export const validarUser = (usuario, setError, update, passwordError) => {
    if (usuario.email === '') {
        setError('Completá el EMail.');
        return false;
    }
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(usuario.email)) {
        setError("Mail Inválido");
        return;
    }
    if (usuario.nombre === '') {
        setError('Completá el Nombre.');
        return false;
    }
    if (usuario.apellido === '') {
        setError('Completá el Apellido.');
        return false;
    }
    if (usuario.consultorio === '') {
        setError('Completá el Apellido.');
        return false;
    }
    if (usuario.password === '') {
        setError('Completá la Contraseña.');
        return false;
    }
    if (passwordError) {
        setError('Las Contraseñas deben Coincidir.');
        return false;
    }
    if (usuario.celular.length < 10) {
        setError('Celular Inválido.');
        return false;
    }
    if (usuario.domicilio === '') {
        setError('Completá el Domicilio.');
        return false;
    }
    if (usuario.cp === '') {
        setError('Completá el Código Postal.');
        return false;
    }
    if (usuario.cp.length < 4) {
        setError('Código Postal Inválido.');
        return false;
    }
    if (usuario.localidad === '') {
        setError('Completá la Localidad.');
        return false;
    }
    if (usuario.provincia === '') {
        setError('Completá la Provincia.');
        return false;
    }
    return true;   
}

export const perfiles = [
    { value: 0, label: "Inhabilitado", bg: '#ffcfd2', emoji: '❌'},
    { value: 1, label: "Odontologo", bg: '#b9fbc0', emoji: '👩‍⚕️'},
    { value: 2, label: "Laboratorio", bg: '#90dbf4', emoji: '🧪'},
    { value: 3, label: "Administrador", bg: '#98f5e1', emoji: '👑'},
];