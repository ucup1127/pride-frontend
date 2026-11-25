export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 39000,
    invitationLimit: 1,
    durationDays: 365,
    galleryLimit: 5,
    description: 'Undangan digital sederhana untuk satu acara.',
    features: [
      '1 website undangan',
      'Template standar',
      'Edit detail acara dan lokasi',
      'RSVP dan ucapan',
      'Galeri hingga 5 foto',
      'Aktif 1 tahun sejak dipublikasikan',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79000,
    invitationLimit: 1,
    durationDays: null,
    galleryLimit: 15,
    featured: true,
    description: 'Lebih banyak pilihan untuk undangan yang personal.',
    features: [
      '1 website undangan',
      'Semua pilihan template',
      'Semua fitur Basic',
      'Musik latar dan tautan tamu personal',
      'Galeri hingga 15 foto',
      'Aktif selama layanan Pride beroperasi',
    ],
  },
  {
    id: 'exclusive',
    name: 'Exclusive',
    price: 149000,
    invitationLimit: 3,
    durationDays: null,
    galleryLimit: 15,
    description: 'Buat hingga tiga website undangan dalam satu akun.',
    features: [
      'Hingga 3 website undangan',
      'Semua fitur Premium untuk setiap undangan',
      'Galeri hingga 15 foto per undangan',
      'Prioritas bantuan',
      'Aktif selama layanan Pride beroperasi',
    ],
  },
];

export const getPackage = (id) => PACKAGES.find((item) => item.id === id);

export const formatPackagePrice = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
