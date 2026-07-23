const SLIKE = [
  'https://images.unsplash.com/photo-1599142296733-1c1f2073e6de?auto=format&fit=crop&w=400&h=560&q=80', // venčanica na plaži
  'https://images.unsplash.com/photo-1549488497-94b52bddac5d?auto=format&fit=crop&w=400&h=560&q=80',     // sweetheart dekolte
  'https://images.unsplash.com/photo-1622277430358-f4d134452e2e?auto=format&fit=crop&w=400&h=560&q=80',  // pored prozora
  'https://images.unsplash.com/photo-1521467752200-3bccf80f16ed?auto=format&fit=crop&w=400&h=560&q=80',  // čipkasta venčanica
  'https://images.unsplash.com/photo-1585241920473-b472eb9ffbae?auto=format&fit=crop&w=400&h=560&q=80',  // cvetni detalji
  'https://images.unsplash.com/photo-1502955422409-06e43fd3eff3?auto=format&fit=crop&w=400&h=560&q=80',  // u zelenilu
  'https://images.unsplash.com/photo-1492175742197-ed20dc5a6bed?auto=format&fit=crop&w=400&h=560&q=80',  // sa bukletom
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=400&h=560&q=80',  // par, venčanica
];


export default function VencanicaCard({ vencanica, model, index = 0 }) {
  const slika = SLIKE[index % SLIKE.length];
  const slobodna = vencanica.status === 0;

  return (
    <div className="v-card">
      <div className="v-card-img-wrap">
        <img src={slika} alt={model?.naziv || 'Venčanica'} className="v-card-img" />
        <div className={`v-card-status ${slobodna ? 'slobodna' : 'iznajmljena'}`}>
          {slobodna ? '✓ Slobodna' : '✗ Iznajmljena'}
        </div>
      </div>
      <div className="v-card-body">
        <h3 className="v-card-title">{model?.naziv || 'Nepoznat model'}</h3>
        {model && <p className="v-card-sub">{model.dizajner}</p>}
        <div className="v-card-tags">
          <span className="tag">{vencanica.velicina}</span>
          {model && <span className="tag">{model.boja}</span>}
          {model && <span className="tag">{model.materijal}</span>}
        </div>
        <p className="v-card-info">
          Serijski br: <strong>{vencanica.serijskiBroj}</strong>
        </p>
        {vencanica.napomene && (
          <p className="v-card-napomena">"{vencanica.napomene}"</p>
        )}
      </div>
    </div>
  );
}