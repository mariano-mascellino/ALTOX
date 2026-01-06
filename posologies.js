function parseNumberOrDefault(value, fallback) {
  var parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function posologies_ms_defaut() {
  return {
    "Lidocaine": 6,
    "Lidocaine_adre": 7,
    "Mepivacaine": 6,
    "Ropivacaine": 3,
    "Bupivacaine": 2.5,
    "Bupivacaine_adre": 2.5,
    "Levobupivacaine": 2.5
  };
}

function posologies_max_ms_defaut() {
  return {
    "Lidocaine": 0,
    "Lidocaine_adre": 500,
    "Mepivacaine": 400,
    "Ropivacaine": 225,
    "Bupivacaine": 0,
    "Bupivacaine_adre": 150,
    "Levobupivacaine": 150
  };
}

function posologies_mi_defaut() {
  return {
    "Lidocaine": 7,
    "Lidocaine_adre": 10,
    "Mepivacaine": 6,
    "Ropivacaine": 4,
    "Bupivacaine": 2.5,
    "Bupivacaine_adre": 2.5,
    "Levobupivacaine": 2.5
  };
}

function posologies_max_mi_defaut() {
  return {
    "Lidocaine": 0,
    "Lidocaine_adre": 700,
    "Mepivacaine": 400,
    "Ropivacaine": 300,
    "Bupivacaine": 0,
    "Bupivacaine_adre": 180,
    "Levobupivacaine": 150
  };
}

function libelles_produits() {
  return {
    "Bupivacaine": "Bupivacaïne",
    "Bupivacaine_adre": "Bupivacaïne adrénalinée",
    "Levobupivacaine": "Lévobupivacaïne",
    "Lidocaine": "Lidocaïne",
    "Lidocaine_adre": "Lidocaïne adrénalinée",
    "Mepivacaine": "Mépivacaïne",
    "Ropivacaine": "Ropivacaïne"
  };
}
