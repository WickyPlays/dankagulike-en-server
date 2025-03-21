exports.login = (req, res) => {
  if (req.user.id) {
    res.redirect("/");
  } else {
    res.render("login");
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.googleCallback = (req, res) => {
  res.redirect("/");
};