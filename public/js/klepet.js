var Klepet = function(socket) {
  this.socket = socket;
};

Klepet.prototype.posljiSporocilo = function(kanal, besedilo) {
  var sporocilo = {
    kanal: kanal,
    besedilo: besedilo
  };
  this.socket.emit('sporocilo', sporocilo);
};

Klepet.prototype.spremeniKanal = function(kanal) {
  this.socket.emit('pridruzitevZahteva', {
    novKanal: kanal
  });
};

Klepet.prototype.procesirajUkaz = function(ukaz) {
  var besede = ukaz.split(' ');
  ukaz = besede[0].substring(1, besede[0].length).toLowerCase();
  var sporocilo = false;

  switch(ukaz) {
    case 'pridruzitev':
      besede.shift();
      var kanal = besede.join(' ');
      this.spremeniKanal(kanal);
      break;
    case 'vzdevek':
      besede.shift();
      var vzdevek = besede.join(' ');
      this.socket.emit('vzdevekSpremembaZahteva', vzdevek);
      break;
    case 'zasebno':
      besede.shift();
      var besedilo = besede.join(' ');
      var parametri = besedilo.split('\"');
      parametri[3] = dodajSlike(parametri[3]);
      if (parametri) {
        this.socket.emit('sporocilo', { vzdevek: parametri[1], besedilo: parametri[3] });
        sporocilo = '(zasebno za ' + parametri[1] + '): ' + parametri[3];
      } else {
        sporocilo = 'Neznan ukaz';
      }
      break;
    default:
      sporocilo = 'Neznan ukaz.';
      break;
  };

  return sporocilo;
};


function dodajSlike(vhodnoBesedilo) {
  var tabBesedilo = vhodnoBesedilo.split(" ");
  for(var i = 0; i < tabBesedilo.length; i++) {
    if(tabBesedilo[i].indexOf('http://') == 0 || tabBesedilo[i].indexOf('https://') == 0) {
      if(tabBesedilo[i].indexOf('.jpg') == (tabBesedilo[i].length - 4)) {
        vhodnoBesedilo += "<div><img src="+tabBesedilo[i]+"></div>";
      }
      if(tabBesedilo[i].indexOf('.png') == (tabBesedilo[i].length - 4)) {
        vhodnoBesedilo += "<div><img src="+tabBesedilo[i]+"></div>";
      }
      if(tabBesedilo[i].indexOf('.gif') == (tabBesedilo[i].length - 4)) {
        vhodnoBesedilo += "<div><img src="+tabBesedilo[i]+"></div>";
      }
    } 
  }
  return vhodnoBesedilo;
}