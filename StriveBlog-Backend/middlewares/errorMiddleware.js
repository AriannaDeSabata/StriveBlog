// Middleware per gestione degli errori
function badRequestHandler(err, req, res, next) {
    if (err.status === 400) {
        return res.status(400).send({ message: err.message || "Bad Request" });
    }
    next(err); // Passa l'errore al middleware successivo
}

function unauthorizedHandler(err, req, res, next) {
    if (err.status === 401) {
        return res.status(401).send({ message: err.message || "Unauthorized" });
    }
    next(err); // Passa l'errore al middleware successivo
}

function notfoundHandler(err, req, res, next) {
    if (err.status === 404) {
        return res.status(404).send({ message: err.message || "Not Found" });
    }
    next(err); // Passa l'errore al middleware successivo
}

// Funzione per gestire gli errori generali (500)
function errorHandler(err, req, res, next) {
    res.status(500).send({ message: "Qualcosa è andato storto. Riprova più tardi."+ err });
}

export default { badRequestHandler, unauthorizedHandler, notfoundHandler, errorHandler };
