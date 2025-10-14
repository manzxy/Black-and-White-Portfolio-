# 🌌 Manzxy — Personal Portfolio Website

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-Modern-red?style=flat-square&logo=html5" />
  <img src="https://img.shields.io/badge/CSS3-Neon%20Glow-blue?style=flat-square&logo=css3" />
  <img src="https://img.shields.io/badge/JavaScript-Interactive-yellow?style=flat-square&logo=javascript" />
</p>

Website **portofolio pribadi modern dan interaktif** bergaya **neon glow futuristik**,  
dilengkapi dengan mode **gelap dan terang** yang dapat diganti secara halus.  
Dibangun menggunakan **HTML, CSS, dan JavaScript murni** tanpa framework berat — ringan, cepat, dan responsif.

---

## ✨ Fitur Utama
- 💡 **Full Dark Neon Theme** — Desain futuristik dengan efek cahaya neon biru–ungu.
- 🔥 **Animated Glow Background** — Efek cahaya neon lembut yang bernafas.
- 🎧 **Built-in Music Player** — Memutar lagu lokal (`song.mp3`) langsung dari browser.
- 🔊 **Audio Visualizer** — Bar animasi mengikuti irama musik.
- 🌫️ **Glassmorphism Navbar** — Navigasi transparan bergaya modern.
- 🧭 **Smooth Scroll + Fade Animation** — Transisi antar section yang lembut dan ringan.
- ⚙️ **Optimized Performance** — Efisien, tidak lag saat scroll atau animasi.

---

## 📁 Struktur Folder

manzxy-portfolio/ │ ├── index.html      # Struktur utama halaman ├── style.css       # Styling & animasi (dark & light mode + glow effect) ├── script.js       # Interaksi, efek scroll, player, dan toggle tema ├── song.mp3        # (Opsional) Lagu yang ingin diputar ├── preview-dark.png  # Screenshot versi dark └── preview-light.png # Screenshot versi light

---

## 🚀 Cara Menjalankan di Localhost
1. Download atau clone project:
   ```bash
   git clone https://github.com/username/manzxy-portfolio.git

2. Masuk ke folder:

cd manzxy-portfolio


3. Pastikan file song.mp3 sudah ada di folder utama.


4. Jalankan di browser:

Klik dua kali index.html, atau

Gunakan Live Server (VSCode extension).





---

🖥️ Instalasi di VPS (Ubuntu Server)

1️⃣ Login ke VPS

ssh root@IP_VPS_KAMU

2️⃣ Install Web Server (Nginx)

apt update && apt upgrade -y
apt install nginx -y
systemctl enable nginx
systemctl start nginx

3️⃣ Upload File Website

Gunakan SCP dari komputer kamu:

scp -r manzxy-portfolio/* root@IP_VPS_KAMU:/var/www/html/

Atau gunakan file manager panel jika ada.

4️⃣ Ubah Permission File

chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

5️⃣ (Opsional) Gunakan Domain

Buat konfigurasi baru:

nano /etc/nginx/sites-available/manzxy.conf

Isi:

server {
    listen 80;
    server_name manzxy.my.id;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

Aktifkan & restart:

ln -s /etc/nginx/sites-available/manzxy.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

Sekarang buka http://manzxy.my.id 🌐

6️⃣ (Opsional) Tambahkan HTTPS Gratis

apt install certbot python3-certbot-nginx -y
certbot --nginx -d manzxy.my.id


---

⚡ Auto Deploy (Opsional)

Agar website otomatis update setiap kali kamu push ke GitHub:

1. Masuk ke VPS:

cd /var/www/html
git init
git remote add origin https://github.com/username/manzxy-portfolio.git


2. Buat file deploy.sh:

nano /root/deploy.sh

Isi:

#!/bin/bash
cd /var/www/html
git pull origin main
systemctl reload nginx
echo "Website updated successfully!"


3. Jadikan executable:

chmod +x /root/deploy.sh


4. Set GitHub webhook ke http://IP_VPS_KAMU:9000/deploy
(Gunakan service kecil seperti webhookd atau express.js kalau mau otomatis penuh.)

--- 

## 📬 Kontak

📱 WhatsApp: [Klik untuk Chat](https://wa.me/6288989721627)
🐙 Gmail: [Klik Untuk Chat](humanznodejs@gmail.com)



---

> 🪩 Dibuat dengan penuh kreativitas dan passion oleh Manzxy
> 🗿Base By Kuray4ku
🌐 Transforming ideas into digital reality.
