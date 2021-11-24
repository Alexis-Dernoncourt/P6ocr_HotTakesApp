const regex = {
    passwordCheck : new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@\\[\\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@\\[\\]^_`{|}~]{8,}$"),
    mailCheck : new RegExp("^[a-zA-Z0-9.!#$%&*+/=?^_{|}~\-]+@[a-zA-Z0-9.!#$%&*+/=?^_~\-]+\\.[a-zA-Z0-9]{2,}$", "ig")
};

exports.regex = regex;