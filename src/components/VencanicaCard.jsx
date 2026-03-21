const SLIKE = [
  'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=400&h=560&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&h=560&q=80',
  'https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=400&h=560&q=80',
  'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=400&h=560&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=560&q=80',
  'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=400&h=560&q=80',
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