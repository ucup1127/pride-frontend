// Daftar template per kategori. Setiap template punya foto sesuai kategori.
export const CATEGORY_COUNTS={
  'Pernikahan':12,
  'Ulang tahun':10,
  'Wisuda':10,
  'Sempro/Semhas':10,
  'Bukber & Khitanan':10,
  'Acara kantor':10,
  'Aqiqah & Tasyakuran':10,
  'Anniversary & Reuni':10
};
export const CATEGORIES=['Semua',...Object.keys(CATEGORY_COUNTS)];

// Foto per kategori (Unsplash)
const PHOTOS={
  'Pernikahan':[
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=900&fit=crop&q=80',
  ],
  'Ulang tahun':[
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578922823119-8d39b48f24a2?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606986628253-05620e9b1c0c?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583878545126-2f1ca0142714?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=600&h=900&fit=crop&q=80',
  ],
  'Wisuda':[
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=900&fit=crop&q=80',
  ],
  'Sempro/Semhas':[
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&h=900&fit=crop&q=80',
  ],
  'Bukber & Khitanan':[
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592978145375-92b24ec7a5d4?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591604021645-17b0e31d6c7c?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519998125030-e0c4e83a0d7e?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593113628328-1bcf4a2beb3e?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=900&fit=crop&q=80',
  ],
  'Acara kantor':[
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=900&fit=crop&q=80',
  ],
  'Aqiqah & Tasyakuran':[
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602906425967-49e5e2da4a1e?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583241800698-e8d5a4b5b6f0?w=600&h=900&fit=crop&q=80',
  ],
  'Anniversary & Reuni':[
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560526865-13d38b0c8a12?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&h=900&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=900&fit=crop&q=80',
  ],
};

const photoFor=(cat,n)=>{
  const arr=PHOTOS[cat]||PHOTOS['Pernikahan'];
  return arr[(n-1)%arr.length];
};

const seeds=[
  {id:'aurelia',name:'Aurelia',style:'Klasik',category:'Pernikahan',tag:'Populer',event:'THE WEDDING OF',names:'Nadia & Raka',date:'12 · 12 · 2026',bg:'#EFE6D3',fg:'#4A3A1E'},
  {id:'verdant',name:'Verdant',style:'Botanikal',category:'Pernikahan',tag:'Baru',event:'THE WEDDING OF',names:'Salsa & Bima',date:'20 · 02 · 2027',bg:'#DDE3D3',fg:'#2F3B2A'},
  {id:'noir',name:'Noir',style:'Modern',category:'Pernikahan',tag:'Populer',event:'THE WEDDING OF',names:'Tari & Dimas',date:'03 · 04 · 2027',bg:'#2A2926',fg:'#E8DCC0'},
  {id:'blush',name:'Blush',style:'Romantis',category:'Pernikahan',tag:'Baru',event:'THE WEDDING OF',names:'Maya & Ardi',date:'15 · 05 · 2027',bg:'#F2DDD6',fg:'#5A3029'},
  {id:'sage',name:'Sage',style:'Minimalis',category:'Pernikahan',tag:'Pilihan',event:'THE WEDDING OF',names:'Lia & Fajar',date:'10 · 07 · 2027',bg:'#E6EADF',fg:'#33402D'},
  {id:'gala',name:'Gala',style:'Elegan',category:'Ulang tahun',tag:'Populer',event:'HAPPY BIRTHDAY',names:'Sinta 30',date:'08 · 03 · 2027',bg:'#F2DDD6',fg:'#5A3029'},
  {id:'toga',name:'Toga',style:'Klasik',category:'Wisuda',tag:'Pilihan',event:'GRADUATION',names:'Bima, S.T.',date:'14 · 08 · 2027',bg:'#DCE6EA',fg:'#243B47'},
  {id:'sidang',name:'Sidang',style:'Formal',category:'Sempro/Semhas',tag:'Akademik',event:'SEMPRO / SEMHAS',names:'Rani Putri',date:'[TANGGAL]',bg:'#E9E6E0',fg:'#2A2926'},
  {id:'iftar',name:'Iftar',style:'Hangat',category:'Bukber & Khitanan',tag:'Hangat',event:'BUKA PUASA BERSAMA',names:'Bukber Alumni',date:'[TANGGAL]',bg:'#EADFC8',fg:'#4A3A1E'},
  {id:'tirta',name:'Tirta',style:'Ceria',category:'Bukber & Khitanan',tag:'Ceria',event:'UNDANGAN KHITANAN',names:'Aksa',date:'24 · 01 · 2027',bg:'#DCE6EA',fg:'#243B47'},
  {id:'forum',name:'Forum',style:'Formal',category:'Acara kantor',tag:'Profesional',event:'ANNUAL GATHERING',names:'[NAMA ACARA]',date:'[TANGGAL]',bg:'#E9E6E0',fg:'#2A2926'},
  {id:'aqiqah-1',name:'Cahaya',style:'Hangat',category:'Aqiqah & Tasyakuran',tag:'Baru',event:'AQIQAH & TASYAKURAN',names:'Aksa Zahran',date:'[TANGGAL]',bg:'#FBF1DC',fg:'#66502D'},
  {id:'anniv-1',name:'Memoria',style:'Klasik',category:'Anniversary & Reuni',tag:'Pilihan',event:'ANNIVERSARY',names:'5 Tahun Bersama',date:'[TANGGAL]',bg:'#E8E0EE',fg:'#49364F'},
];

const styles=[['Luna','#F2DDD6','#5A3029'],['Arunika','#EADFC8','#4A3A1E'],['Senja','#E6EADF','#33402D'],['Velvet','#2A2926','#E8DCC0'],['Bloom','#F4E8DF','#67443A'],['Aster','#DCE6EA','#243B47'],['Nara','#FBF1DC','#66502D'],['Elara','#E8E0EE','#49364F'],['Kirana','#E1E9DF','#304532'],['Mori','#E9E6E0','#2A2926'],['Sora','#DDE8EC','#27424A'],['Rumi','#F1E2D1','#634A31']];

const meta={
  'Pernikahan':['THE WEDDING OF','Nadia & Raka'],
  'Ulang tahun':['HAPPY BIRTHDAY','Sinta 25'],
  'Wisuda':['GRADUATION','Bima, S.T.'],
  'Sempro/Semhas':['SEMPRO / SEMHAS','Rani Putri'],
  'Bukber & Khitanan':['UNDANGAN ACARA','Keluarga Besar'],
  'Acara kantor':['CORPORATE EVENT','Annual Gathering'],
  'Aqiqah & Tasyakuran':['AQIQAH & TASYAKURAN','Buah Hati Kami'],
  'Anniversary & Reuni':['ANNIVERSARY','Momen Berharga'],
};

export const TEMPLATES=Object.keys(CATEGORY_COUNTS).flatMap(cat=>{
  const base=seeds.filter(t=>t.category===cat).map((t,i)=>({...t,img:photoFor(cat,i+1)}));
  const items=[...base];
  for(let i=items.length;i<CATEGORY_COUNTS[cat];i++){
    const s=styles[(i+Object.keys(CATEGORY_COUNTS).indexOf(cat)*2)%styles.length];
    const [event,names]=meta[cat]||['SPECIAL EVENT','Tamu Undangan'];
    items.push({
      id:`${cat.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${i+1}`,
      name:s[0],
      style:['Minimalis','Modern','Elegan','Botanikal','Klasik'][i%5],
      category:cat,
      tag:i===0?'Pilihan':'Bisa diedit',
      event,names,
      date:'[TANGGAL]',
      bg:s[1],fg:s[2],
      img:photoFor(cat,i+1)
    });
  }
  return items;
});

export const FEATURED_IDS=['aurelia','gala','toga'];
export const findTemplate=id=>TEMPLATES.find(t=>t.id===id)||TEMPLATES[0];