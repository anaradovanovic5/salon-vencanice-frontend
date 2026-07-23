export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Bella Sposa</h3>
          <p>Salon za venčanice — vaš san, naša misija</p>
        </div>
        <div className="footer-links">
          <h4>Navigacija</h4>
          <a href="/">Početna</a>
          <a href="/katalog">Katalog</a>
          <a href="/search">Pretraga</a>
          <a href="/o-nama">O Nama</a>
        </div>
        <div className="footer-contact">
          <h4>Kontakt</h4>
          <p>📍 Knez Mihailova 5, Beograd</p>
          <p>📞 +381 11 123 4567</p>
          <p>✉️ info@bellasposa.rs</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Bella Sposa Salon. Sva prava zadržana.</p>
      </div>
    </footer>
  );
}