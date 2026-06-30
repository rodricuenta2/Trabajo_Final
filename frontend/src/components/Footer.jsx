function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold">Gamers Pro</h5>
            <p className="text-muted small mb-0">
              Tu tienda especializada en tecnología y gaming.
            </p>
          </div>
          <div className="col-md-3">
            <h6>Enlaces</h6>
            <ul className="list-unstyled small">
              <li><a href="/" className="text-muted text-decoration-none">Catálogo</a></li>
              <li><a href="/login" className="text-muted text-decoration-none">Iniciar Sesión</a></li>
              <li><a href="/register" className="text-muted text-decoration-none">Registrarse</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Contacto</h6>
            <ul className="list-unstyled small text-muted">
              <li>contacto@gamerspro.cl</li>
              <li>+56 9 1234 5678</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-muted small">
          &copy; {new Date().getFullYear()} Gamers Pro. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
