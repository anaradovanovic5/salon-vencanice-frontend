export default function ONama() {
  return (
    <div className="page-inner">
      <div className="katalog-header">
        <h1>O Nama</h1>
        <p>Naša priča i vrednosti</p>
      </div>

      <div className="o-nama-hero">
        <img
          src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&h=500&fit=crop"
          alt="Salon"
          className="o-nama-img"
        />
      </div>

      <div className="o-nama-grid">
        <div className="o-nama-text">
          <h2>Naša priča</h2>
          <p>Bella Sposa salon osnovan je sa jednom misijom — pomoći svakoj nevesti da pronađe
          venčanicu svojih snova. Sa dugogodišnjim iskustvom u modni industriji, naš tim
          pažljivo bira svaki komad koji uđe u našu kolekciju.</p>
          <p>Verujemo da svaka nevesta zaslužuje da se oseća posebno i prelepo na svom
          najvećem danu. Zbog toga nudimo personalizovanu uslugu od prvog kontakta
          pa sve do venčanja.</p>
          <h2 style={{marginTop: '28px'}}>Naša misija</h2>
          <p>Pružiti nezaboravno iskustvo pronalaska savršene venčanice, uz vrhunsku
          uslugu i ekskluzivne dizajne koji odgovaraju svakom budžetu.</p>
        </div>

        <div className="o-nama-info">
          <div className="info-card">
            <h3>📍 Adresa</h3>
            <p>Knez Mihailova 5<br />11000 Beograd</p>
          </div>
          <div className="info-card">
            <h3>🕐 Radno vreme</h3>
            <p>Pon–Pet: 09:00–20:00<br />Sub: 10:00–18:00<br />Ned: zatvoreno</p>
          </div>
          <div className="info-card">
            <h3>📞 Kontakt</h3>
            <p>Tel: +381 11 123 4567<br />info@bellasposa.rs</p>
          </div>
          <div className="info-card">
            <h3>✨ Iskustvo</h3>
            <p>Više od 500 srećnih nevesti<br />10+ godina tradicije</p>
          </div>
        </div>
      </div>

      <section className="section bg-light" style={{borderRadius: '16px', padding: '40px', marginTop: '40px'}}>
        <div className="section-header">
          <h2>Naš tim</h2>
          <p>Stručnjaci koji su tu za vas</p>
        </div>
        <div className="tim-grid">
          {[
            { ime: 'Marija Jović',    uloga: 'Stilist venčanica',   img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
            { ime: 'Stefan Petrović', uloga: 'Menadžer salona',      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
            { ime: 'Jovana Nikolić',  uloga: 'Konsultant za modu',  img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
          ].map(({ ime, uloga, img }) => (
            <div key={ime} className="tim-card">
              <img src={img} alt={ime} className="tim-img" />
              <h3>{ime}</h3>
              <p>{uloga}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}