import { useEffect, useMemo, useRef, useState } from 'react';
import { readSheet } from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';
import Button from '../components/Button';
import DashboardShell from '../components/DashboardShell';
import { addGuest, bulkAddGuests, deleteGuest, listGuests, listUndangan } from '../services/api';

const PAGE_SIZES = [50, 100, 200, 500];
const CATEGORIES = ['keluarga', 'teman', 'kerja', 'vip', 'lainnya'];
const TEMPLATE_HEADERS = ['Nama', 'Jumlah', 'Kategori', 'Telepon'];
const HEADER_ALIASES = {
  nama: ['nama', 'nama tamu'],
  jumlah: ['jumlah', 'jumlah orang'],
  kategori: ['kategori', 'jenis tamu'],
  telepon: ['telepon', 'no telepon', 'nomor telepon', 'whatsapp'],
};

function normalizePhone(value) {
  if (value === undefined || value === null || value === '') return '';
  let digits = String(value).trim().replace(/\D/g, '');
  if (digits.startsWith('0062')) digits = digits.slice(4);
  else if (digits.startsWith('62')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  return /^8\d{8,12}$/.test(digits) ? digits : null;
}

function normalizeCategory(value) {
  if (value === undefined || value === null || String(value).trim() === '') return '';
  const category = String(value).trim().toLowerCase();
  return category === 'lain-lain' ? 'lainnya' : CATEGORIES.includes(category) ? category : null;
}

function readCell(row, index) {
  return index < 0 ? '' : row[index] ?? '';
}

function parseGuestRows(rows) {
  if (!rows.length) throw new Error('File Excel tidak memiliki baris header.');
  const headers = rows[0].map((cell) => String(cell ?? '').trim().toLowerCase());
  const columns = Object.fromEntries(
    Object.entries(HEADER_ALIASES).map(([field, aliases]) => [
      field,
      headers.findIndex((header) => aliases.includes(header)),
    ]),
  );
  if (columns.nama < 0) throw new Error('Kolom "Nama" wajib tersedia pada baris pertama.');

  const valid = [];
  const issues = [];
  rows.slice(1).forEach((row, index) => {
    const line = index + 2;
    if (!row?.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== '')) return;

    const nama = String(readCell(row, columns.nama)).trim();
    const rawCount = readCell(row, columns.jumlah);
    const jumlah = rawCount === '' ? 1 : Number(rawCount);
    const kategori = normalizeCategory(readCell(row, columns.kategori));
    const telepon = normalizePhone(readCell(row, columns.telepon));
    const errors = [];

    if (nama.length < 2) errors.push('nama harus memiliki minimal 2 karakter');
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) errors.push('jumlah harus berupa angka 1–20');
    if (kategori === null) errors.push('kategori tidak dikenal');
    if (telepon === null) errors.push('nomor telepon tidak valid');

    if (errors.length) {
      issues.push(`Baris ${line}: ${errors.join(', ')}.`);
      return;
    }

    valid.push({
      line,
      guest: {
        nama,
        jumlah,
        ...(kategori ? { kategori } : {}),
        ...(telepon ? { telepon } : {}),
      },
    });
  });

  return { valid, issues };
}

function guestStatus(status) {
  return {
    pending: { label: 'Belum konfirmasi', className: 'status--wait' },
    hadir: { label: 'Hadir', className: 'status--yes' },
    tidak_hadir: { label: 'Tidak hadir', className: 'status--no' },
    ragu: { label: 'Ragu', className: 'status--wait' },
  }[status] || { label: status || 'Belum konfirmasi', className: 'status--wait' };
}

export default function Guests() {
  const [invitations, setInvitations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [guests, setGuests] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draft, setDraft] = useState({ nama: '', jumlah: '1', kategori: '', telepon: '' });
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState([]);
  const [issueCount, setIssueCount] = useState(0);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [detailGuest, setDetailGuest] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const selectAllRef = useRef(null);
  const dialogCloseRef = useRef(null);

  useEffect(() => {
    let active = true;
    listUndangan()
      .then((items) => {
        if (!active) return;
        setInvitations(items);
        setSelectedId((current) => current || items[0]?.id || '');
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Daftar undangan gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoadingInvitations(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setGuests([]);
      return undefined;
    }
    let active = true;
    setLoadingGuests(true);
    setError('');
    listGuests(selectedId)
      .then((items) => {
        if (active) setGuests(items);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Daftar tamu gagal dimuat.');
      })
      .finally(() => {
        if (active) setLoadingGuests(false);
      });

    return () => {
      active = false;
    };
  }, [selectedId, refreshKey]);

  const filteredGuests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return guests;
    return guests.filter((guest) =>
      [guest.nama, guest.kategori, guest.telepon, guest.status]
        .some((value) => String(value || '').toLowerCase().includes(normalizedQuery)),
    );
  }, [guests, query]);
  const pageCount = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const visibleGuests = filteredGuests.slice((page - 1) * pageSize, page * pageSize);
  const visibleGuestIds = visibleGuests.map((guest) => guest.id);
  const allVisibleSelected = visibleGuestIds.length > 0 &&
    visibleGuestIds.every((id) => selectedGuestIds.includes(id));
  const someVisibleSelected = visibleGuestIds.some((id) => selectedGuestIds.includes(id));
  const selectedInvitation = invitations.find((item) => item.id === selectedId);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  useEffect(() => {
    if (detailGuest || pendingDelete) dialogCloseRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setDetailGuest(null);
        if (!deleting) setPendingDelete(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [detailGuest, pendingDelete, deleting]);

  const toggleVisibleSelection = (checked) => {
    setSelectedGuestIds((current) => {
      if (checked) return [...new Set([...current, ...visibleGuestIds])];
      return current.filter((id) => !visibleGuestIds.includes(id));
    });
  };

  const toggleGuestSelection = (guestId, checked) => {
    setSelectedGuestIds((current) => checked
      ? [...new Set([...current, guestId])]
      : current.filter((id) => id !== guestId));
  };

  const confirmDeleteGuests = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    setError('');
    const deletedIds = [];
    const failures = [];

    for (let start = 0; start < pendingDelete.ids.length; start += 20) {
      const batch = pendingDelete.ids.slice(start, start + 20);
      const results = await Promise.all(batch.map(async (id) => {
        try {
          await deleteGuest(id);
          return { id };
        } catch (deleteError) {
          return { id, error: deleteError.message || 'Gagal dihapus.' };
        }
      }));
      results.forEach((result) => {
        if (result.error) failures.push(result);
        else deletedIds.push(result.id);
      });
    }

    setGuests((current) => current.filter((guest) => !deletedIds.includes(guest.id)));
    setSelectedGuestIds((current) => current.filter((id) => !deletedIds.includes(id)));
    if (deletedIds.length) {
      setNotice(`${deletedIds.length} tamu berhasil dihapus.`);
    }
    if (failures.length) {
      setError(`${failures.length} tamu gagal dihapus. ${failures[0].error}`);
    }
    setPendingDelete(null);
    setDeleting(false);
  };

  const onAddGuest = async (event) => {
    event.preventDefault();
    setError('');
    const nama = draft.nama.trim();
    const jumlah = Number(draft.jumlah);
    const telepon = normalizePhone(draft.telepon);
    if (nama.length < 2) {
      setError('Nama tamu harus memiliki minimal 2 karakter.');
      return;
    }
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 20) {
      setError('Jumlah tamu harus berupa angka 1–20.');
      return;
    }
    if (telepon === null) {
      setError('Nomor telepon harus menggunakan nomor Indonesia yang valid.');
      return;
    }

    try {
      const created = await addGuest({
        undanganId: selectedId,
        nama,
        jumlah,
        ...(draft.kategori ? { kategori: draft.kategori } : {}),
        ...(telepon ? { telepon } : {}),
      });
      setGuests((current) => [...current, created]);
      setDraft({ nama: '', jumlah: '1', kategori: '', telepon: '' });
      setShowAddForm(false);
      setNotice(`${nama} ditambahkan ke daftar tamu.`);
    } catch (saveError) {
      setError(saveError.message || 'Tamu gagal ditambahkan.');
    }
  };

  const downloadTemplate = async () => {
    setError('');
    try {
      const header = TEMPLATE_HEADERS.map((value) => ({
        value,
        fontWeight: 'bold',
        backgroundColor: '#f1ecdf',
      }));
      const blob = await writeXlsxFile([header], {
        sheet: 'Daftar Tamu',
        columns: [{ width: 28 }, { width: 12 }, { width: 16 }, { width: 20 }],
      }).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-daftar-tamu.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(downloadError.message || 'Template Excel gagal dibuat.');
    }
  };

  const onImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImporting(true);
    setError('');
    setNotice('');
    setIssues([]);
    setIssueCount(0);

    try {
      const rows = await readSheet(file);
      const { valid, issues: rowIssues } = parseGuestRows(rows);
      if (!valid.length) {
        setError(rowIssues.length
          ? 'Tidak ada baris valid untuk diimpor.'
          : 'File belum berisi data tamu.');
        setIssues(rowIssues.slice(0, 8));
        setIssueCount(rowIssues.length);
        return;
      }

      let imported = 0;
      const failedBatches = [];
      for (let start = 0; start < valid.length; start += 200) {
        const batchRows = valid.slice(start, start + 200);
        const batch = batchRows.map((row) => row.guest);
        try {
          const result = await bulkAddGuests(selectedId, batch);
          imported += Number(result.count) || batch.length;
        } catch (batchError) {
          failedBatches.push(
            `Baris ${batchRows[0].line}–${batchRows[batchRows.length - 1].line}: ${batchError.message || 'gagal disimpan.'}`,
          );
        }
      }

      const allIssues = [...rowIssues, ...failedBatches];
      setIssues(allIssues.slice(0, 8));
      setIssueCount(allIssues.length);
      setNotice(`${imported} tamu berhasil diimpor${rowIssues.length ? `, ${rowIssues.length} baris dilewati` : ''}${failedBatches.length ? `, ${failedBatches.length} batch gagal` : ''}.`);
      setRefreshKey((current) => current + 1);
    } catch (importError) {
      setError(importError.message || 'File Excel gagal dibaca.');
    } finally {
      setImporting(false);
    }
  };

  const setSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <DashboardShell activeMenu="daftar-tamu">
      <header className="dash__top guests__top">
        <div>
          <div className="eyebrow">KEHADIRAN · {guests.length} TAMU</div>
          <h1 className="display">Daftar tamu</h1>
          <p>Tambah, cari, dan kelola tamu undanganmu.</p>
        </div>
      </header>

      {error && <div className="dash__message dash__message--error" role="alert">{error}</div>}
      {notice && <div className="dash__message" role="status">{notice}</div>}
      {issues.length > 0 && (
        <div className="guests__issues" role="status">
          <strong>Detail impor ({issueCount} masalah)</strong>
          <ul>{issues.map((item) => <li key={item}>{item}</li>)}</ul>
          {issueCount > issues.length && <span>dan {issueCount - issues.length} masalah lainnya.</span>}
        </div>
      )}

      {loadingInvitations ? (
        <section className="dash__panel guests__loading" aria-live="polite">Memuat undangan…</section>
      ) : invitations.length === 0 ? (
        <section className="dash__panel dash__empty">
          <span aria-hidden="true">✦</span>
          <h2>Belum ada undangan</h2>
          <p>Buat undangan terlebih dahulu sebelum menambahkan daftar tamu.</p>
          <Button to="/katalog" variant="primary" size="sm">Pilih desain undangan</Button>
        </section>
      ) : (
        <>
          <section className="dash__panel guests__toolbar">
            <div className="guests__toolbar-top">
              {invitations.length > 1 ? (
                <label className="field guests__invitation-select">
                  <span>Pilih undangan</span>
                  <select
                    className="input"
                    value={selectedId}
                    onChange={(event) => {
                      setSelectedId(event.target.value);
                      setSelectedGuestIds([]);
                      setPage(1);
                    }}
                  >
                    {invitations.map((item) => (
                      <option key={item.id} value={item.id}>{item.judul || 'Undangan tanpa judul'}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="guests__invitation-name">
                  <span>UNDANGAN AKTIF</span>
                  <strong>{selectedInvitation?.judul || 'Undangan'}</strong>
                </div>
              )}
              <div className="guests__actions">
                <button type="button" className="btn" onClick={downloadTemplate}>
                  Unduh template
                </button>
                <label className={`btn guests__file-button${importing ? ' is-disabled' : ''}`}>
                  {importing ? 'Mengimpor…' : 'Impor Excel'}
                  <input
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={onImportFile}
                    disabled={importing || !selectedId}
                    aria-label="Pilih file Excel daftar tamu"
                  />
                </label>
                <Button variant="primary" onClick={() => setShowAddForm((open) => !open)}>
                  Tambah tamu
                </Button>
              </div>
            </div>
            <p className="guests__hint">
              Format: <strong>Nama</strong>, <strong>Jumlah</strong> (1–20), <strong>Kategori</strong> (keluarga, teman, kerja, vip, lainnya), dan <strong>Telepon</strong> (opsional).
            </p>
          </section>

          {showAddForm && (
            <form className="dash__panel guests__add-form" onSubmit={onAddGuest}>
              <label className="field">
                <span>Nama tamu</span>
                <input className="input" value={draft.nama} onChange={(event) => setDraft({ ...draft, nama: event.target.value })} required minLength={2} />
              </label>
              <label className="field">
                <span>Jumlah</span>
                <input className="input" type="number" min="1" max="20" value={draft.jumlah} onChange={(event) => setDraft({ ...draft, jumlah: event.target.value })} required />
              </label>
              <label className="field">
                <span>Kategori</span>
                <select className="input" value={draft.kategori} onChange={(event) => setDraft({ ...draft, kategori: event.target.value })}>
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Telepon (opsional)</span>
                <input className="input" inputMode="tel" value={draft.telepon} onChange={(event) => setDraft({ ...draft, telepon: event.target.value })} placeholder="081234567890" />
              </label>
              <Button type="submit" variant="primary">Simpan tamu</Button>
            </form>
          )}

          <section className="dash__panel guests__list-panel">
            <div className="guests__list-controls">
              <label className="guests__select-page">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => toggleVisibleSelection(event.target.checked)}
                  aria-label="Pilih semua tamu pada halaman ini"
                />
                <span>Pilih halaman</span>
              </label>
              <label className="field guests__search">
                <span>Cari tamu</span>
                <input
                  className="input"
                  type="search"
                  value={query}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nama, kategori, atau telepon"
                />
              </label>
              <label className="field guests__page-size">
                <span>Tampilkan</span>
                <select
                  className="input"
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>

            {selectedGuestIds.length > 0 && (
              <div className="guests__selection-bar">
                <span>{selectedGuestIds.length} tamu dipilih</span>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => setPendingDelete({
                    ids: selectedGuestIds,
                    label: `${selectedGuestIds.length} tamu yang dipilih`,
                  })}
                >
                  Hapus yang dipilih
                </button>
              </div>
            )}

            {loadingGuests ? (
              <div className="guests__empty">Memuat daftar tamu…</div>
            ) : filteredGuests.length === 0 ? (
              <div className="guests__empty">
                {query
                  ? <>Tidak ada tamu yang cocok dengan “{query}”.</>
                  : <>Belum ada tamu. Tambahkan secara manual atau impor dari Excel.</>}
              </div>
            ) : (
              <>
                <div className="dash__table-wrap guests__table-wrap">
                  <table className="dash__table guests__table">
                    <thead>
                      <tr>
                        <th className="guests__select-cell" scope="col" aria-label="Pilih" />
                        <th scope="col">Nama</th>
                        <th scope="col">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleGuests.map((guest) => {
                        return (
                          <tr key={guest.id}>
                            <td className="guests__select-cell" data-label="Pilih">
                              <input
                                type="checkbox"
                                checked={selectedGuestIds.includes(guest.id)}
                                onChange={(event) => toggleGuestSelection(guest.id, event.target.checked)}
                                aria-label={`Pilih ${guest.nama}`}
                              />
                            </td>
                            <td data-label="Nama">{guest.nama}</td>
                            <td data-label="Aksi">
                              <div className="guests__row-actions">
                                <button type="button" className="link-button" onClick={() => setDetailGuest(guest)}>
                                  Detail
                                </button>
                                <button
                                  type="button"
                                  className="link-button guests__delete-link"
                                  onClick={() => setPendingDelete({ ids: [guest.id], label: guest.nama })}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="guests__pagination">
                  <span>
                    Menampilkan {filteredGuests.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredGuests.length)} dari {filteredGuests.length} tamu
                  </span>
                  <div>
                    <button type="button" className="btn" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                      Sebelumnya
                    </button>
                    <span>Halaman {page} dari {pageCount}</span>
                    <button type="button" className="btn" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>
                      Berikutnya
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </>
      )}

      {detailGuest && (
        <div className="guests__overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailGuest(null);
        }}>
          <section
            className="guests__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-detail-title"
          >
            <button
              ref={dialogCloseRef}
              type="button"
              className="guests__dialog-close"
              aria-label="Tutup detail tamu"
              onClick={() => setDetailGuest(null)}
            >
              ×
            </button>
            <div className="eyebrow">INFORMASI TAMU</div>
            <h2 id="guest-detail-title" className="display">{detailGuest.nama}</h2>
            <dl className="guests__detail-list">
              <div><dt>Kategori</dt><dd>{detailGuest.kategori || '—'}</dd></div>
              <div><dt>Nomor RSVP</dt><dd>{detailGuest.telepon || '—'}</dd></div>
              <div><dt>Jumlah undangan</dt><dd>{detailGuest.jumlah || 1} orang</dd></div>
              <div><dt>Status RSVP</dt><dd>{guestStatus(detailGuest.status).label}</dd></div>
              {detailGuest.catatan && <div><dt>Catatan</dt><dd>{detailGuest.catatan}</dd></div>}
            </dl>
          </section>
        </div>
      )}

      {pendingDelete && (
        <div className="guests__overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deleting) setPendingDelete(null);
        }}>
          <section
            className="guests__dialog guests__delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="guest-delete-title"
            aria-describedby="guest-delete-description"
          >
            <button
              ref={dialogCloseRef}
              type="button"
              className="guests__dialog-close"
              aria-label="Batal menghapus"
              disabled={deleting}
              onClick={() => setPendingDelete(null)}
            >
              ×
            </button>
            <div className="eyebrow">KONFIRMASI</div>
            <h2 id="guest-delete-title" className="display">Hapus daftar tamu?</h2>
            <p id="guest-delete-description">
              {pendingDelete.label} akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="guests__dialog-actions">
              <button type="button" className="btn" disabled={deleting} onClick={() => setPendingDelete(null)}>
                Batal
              </button>
              <button type="button" className="btn btn--danger" disabled={deleting} onClick={confirmDeleteGuests}>
                {deleting ? 'Menghapus…' : 'Ya, hapus'}
              </button>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
