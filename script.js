document.addEventListener('DOMContentLoaded', () => {
	mise_en_place();
	creer_evenements(); //créé les liens entre les événements qui modifient le contenu et la fonction mise à jour
});


//ajuste les éléments pour la première utilisation
function mise_en_place() {
	desactiver_AL("2");
	mise_en_place_valeur_fragile();
	toutmasquer();
}

// à chaque événement, recalcule l'ensemble des éléments de la page
function mise_a_jour() {
	//met à jour le contenu du bloc 1
	var AL1_f = mise_a_jour_AL("1");
	//met à jour le contenu du bloc 2 (même si désactivé)
	var AL2_f = mise_a_jour_AL("2");

	//si bloc1 complet
	if (AL1_f.complet) {
		//activer bloc2
		activer_AL("2");
		//si bloc2 complet
		if (AL2_f.complet) {
			//mise à jour addition volumes égaux
			//mise à jour addition volumes différents
			mise_a_jour_volumes_egaux(AL1_f.volmax, AL2_f.volmax);
			mise_a_jour_volumes_differents(AL1_f.volmax, AL2_f.volmax);

			//afficher addition volumes égaux
			//afficher addition volumes différents
			afficher_blocs_addition();
		}
		//si bloc2 incomplet
		else {
			//masque addition volumes égaux
			//masquer addition volumes différents
			masquer_blocs_addition();
		}
	}
	//si bloc1 incomplet
	else {
		//masquer addition volumes égaux
		//masquer addition volumes différents
		masquer_blocs_addition();
		//desactiver bloc2
		desactiver_AL(2);
	}
}

function mise_a_jour_AL(AL) {
	var produit = document.getElementById('Produit' + AL).value;
	var site = document.getElementById('Site' + AL).value;
	var poids = document.getElementById('poids').value;
	var poso = Math.round(poids * posologie(produit, site));
	var poso_max = posologie_max(produit, site);
	var fragile = document.getElementById('fragile').checked;
	var concentration = document.getElementById('Concentration' + AL).value;

	//on borne la poso si besoin
	if (poso_max != 0 && poso > poso_max) {
		poso = poso_max;
	}

	//on réduit la dose si besoin
	if (fragile) {
		poso = Math.round((1 - reduction_fragile() / 100) * poso)
	};

	//calcul du volume
	var volume = Math.round(poso / concentration);
	//si produit choisi ET site choisi
	if (produit != 'rien' && site != 'rien') {
		if (poids != '') //si poids déterminé
		{
			//on affiche la dose max en mg
			document.getElementById('Posologie' + AL).innerHTML = 'La dose maximale à ne pas dépasser est de <span class="resultat" >' + poso + " mg.</span>";
			document.getElementById('Posologie' + AL).style.display = '';
			//on affiche le choix de la concentration
			document.getElementById('Concentration' + AL).style.display = '';
			//si concentration non choisie
			if (concentration == "rien") {
				//on masque le volume max
				document.getElementById('VolumeMax' + AL).style.display = 'none';
			} else { //si concentration choisie

				//on affiche le volume max en ml
				document.getElementById('VolumeMax' + AL).innerHTML = 'Pour cette concentration, le volume maximal recommandé est de <span class="resultat">' + volume + " ml.</span>";
				document.getElementById('VolumeMax' + AL).style.display = '';
				return {
					complet: true,
					volmax: volume
				};
			}
		} 
        else //si poids non choisi
		{
			//on affiche la dose max en mg/kg  
			var texte = 'La dose maximale est de <span class="resultat">' + posologie(produit, site) + " mg/kg </span>";
			if (poso_max != 0) {
				texte = texte + ' sans dépasser <span class="resultat">' + poso_max + ' mg</span>';
			}
			texte = texte + '.'
			document.getElementById('Posologie' + AL).innerHTML = texte;
			document.getElementById('Posologie' + AL).style.display = '';
			document.getElementById('Concentration' + AL).style.display = 'none';
			document.getElementById('VolumeMax' + AL).style.display = 'none';
		}
	} 
    else {
		//on masque la dose max en mg/kg ou en mg
		document.getElementById('Posologie' + AL).style.display = 'none';
		document.getElementById('Concentration' + AL).style.display = 'none';
		document.getElementById('VolumeMax' + AL).style.display = 'non';
	}
	return {
		complet: false,
		volmax: 0
	}; //on indique que le formulaire est incomplet

}


function posologie(produit, site) {
	//en mg/kg
	var posologie_membre_superieur = {
		"Lidocaine": 6,
		"Lidocaine_adre": 7,
		"Mepivacaine": 6,
		"Ropivacaine": 3,
		"Bupivacaine": 2.5,
		"Bupivacaine_adre": 2.5,
		"Levobupivacaine": 2.5,
	};

	var posologie_membre_inferieur = {
		"Lidocaine": 7,
		"Lidocaine_adre": 10,
		"Mepivacaine": 6,
		"Ropivacaine": 4,
		"Bupivacaine": 2.5,
		"Bupivacaine_adre": 2.5,
		"Levobupivacaine": 2.5,
	};

	if (site == "Membre_superieur") {
		var valeur_modifiee = localStorage.getItem(String("relatif_ms_").concat(produit));
		if (valeur_modifiee != null) {
			return valeur_modifiee;
		}
		return posologie_membre_superieur[produit];
	} 
    else if (site == "Membre_inferieur") {
		var valeur_modifiee = localStorage.getItem(String("relatif_mi_").concat(produit));
		if (valeur_modifiee != null) {
			return valeur_modifiee;
		}
		return posologie_membre_inferieur[produit];
	}

	return 0;
}

function posologie_max(produit, site) {
	//en mg
	var posologie_max_membre_superieur = {
		"Lidocaine": 0,
		"Lidocaine_adre": 500,
		"Mepivacaine": 400,
		"Ropivacaine": 225,
		"Bupivacaine": 0,
		"Bupivacaine_adre": 150,
		"Levobupivacaine": 150,
	};

	var posologie_max_membre_inferieur = {
		"Lidocaine": 0,
		"Lidocaine_adre": 700,
		"Mepivacaine": 400,
		"Ropivacaine": 300,
		"Bupivacaine": 0,
		"Bupivacaine_adre": 180,
		"Levobupivacaine": 150,
	};

	if (site == "Membre_superieur") {
		var valeur_modifiee = localStorage.getItem(String("absolu_ms_").concat(produit));
		if (valeur_modifiee != null) {
			return valeur_modifiee;
		}
		return posologie_max_membre_superieur[produit]
	} 
    else if (site == "Membre_inferieur") {
		var valeur_modifiee = localStorage.getItem(String("relatif_mi_").concat(produit));
		if (valeur_modifiee != null) {
			return valeur_modifiee;
		}
		return posologie_max_membre_inferieur[produit];
	}
	return 0;

}

function afficher_blocs_addition() {
	slideDown(document.getElementById('blocMelangeVolumesDifferents'))
	slideDown(document.getElementById('blocMelangeVolumesEgaux'))
}


function masquer_blocs_addition() {
	slideUp(document.getElementById('blocMelangeVolumesDifferents'));
	slideUp(document.getElementById('blocMelangeVolumesEgaux'));
}

function creer_evenements() {
	document.getElementById("poids").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("fragile").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Produit1").addEventListener('change', () => {
		$('#Concentration1 option:eq(0)').prop('selected', true);
		mise_a_jour();
	});
	document.getElementById("Site1").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Concentration1").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Volume1").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Produit2").addEventListener('change', () => {
		$('#Concentration2 option:eq(0)').prop('selected', true);
		mise_a_jour();
	});
	document.getElementById("Site2").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Concentration2").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("Volume2").addEventListener('change', () => {
		mise_a_jour();
	});
	document.getElementById("banniere").addEventListener('click', () => {
		location.reload();
	});
}

function activer_AL(AL) {
	fadeIn(document.getElementById('blocAL' + AL));
	document.getElementById('Produit' + AL).removeAttribute('disabled');
	document.getElementById('Site' + AL).removeAttribute("disabled");
	document.getElementById('Concentration' + AL).removeAttribute("disabled");
}

function mise_a_jour_volumes_egaux(vol1, vol2) {
	document.getElementById('resultatMelangeVolumesEgaux').innerHTML = (Math.round((vol1 + vol2) / 2).toString()) + " ml";
}

function mise_a_jour_volumes_differents(volmax1, volmax2) {
	var vol1 = document.getElementById('Volume1').value;
	var vol2 = document.getElementById('Volume2').value;
	var doserel1 = Math.round(vol1 / volmax1 * 100);
	var doserel2 = Math.round(vol2 / volmax2 * 100);
	//on actualise les titres des anesthésiques locaux
	document.getElementById('LibelleProduit1').innerHTML = document.querySelector('#Produit1 option:checked').text + " (" + document.querySelector('#Concentration1 option:checked').text + ')';
	document.getElementById('LibelleProduit2').innerHTML = document.querySelector('#Produit2 option:checked').text + " (" + document.querySelector('#Concentration2 option:checked').text + ')';

	//si Volume1 choisi
	if (vol1 != '') {
		//on modifie le texte de la dose relative
		var texte = 'Ce volume représente ';
		texte = texte + doserel1;
		texte = texte + "% de la dose toxique.";
		document.getElementById('ResultatPartiel1').innerHTML = texte;

		//on change la couleur si toxique ou non
		if (doserel1 > 100) {
			document.getElementById('ResultatPartiel1').className = 'dosetoxique';
		} 
        else {
			document.getElementById('ResultatPartiel1').className = 'dosenontoxique';
		}

		//on affiche
		document.querySelector("#ResultatPartiel1").style.display = "block";
	} 
    else {
		//sinon
		//on cache la dose relative 1
		document.querySelector("#ResultatPartiel1").style.display = "none";

		// si vol2 déterminé
		if (vol2 != '') {
			//on affiche une suggestion de complément de volume max en placeholder
			var complement = Math.round(volmax1 * (1 - vol2 / volmax2));
			document.querySelector('#Volume1').setAttribute('placeholder', String('max. ') + complement);
			if (complement > 0) {
				document.querySelector('#Volume1').setAttribute('placeholder', String('max. ') + complement);
			} else {
				document.querySelector('#Volume1').setAttribute('placeholder', '-');
			}
		} 
        else {
			//sinon on réinitialise le placeholder volume1
			document.querySelector('#Volume1').setAttribute('placeholder', String('Volume'));
		}
	}

	//si Volume2 choisi
	if (vol2 != '') {
		//on modifie le texte de la dose relative
		var texte = "Ce volume représente ";
		texte = texte.concat(doserel2);
		texte = texte.concat("% de la dose toxique.");
		document.getElementById('ResultatPartiel2').innerHTML = texte;

		//on change la couleur si toxique ou non
		if (doserel2 > 100) {
			document.getElementById('ResultatPartiel2').className = 'dosetoxique';
		}
        else {
			document.getElementById('ResultatPartiel2').className = 'dosenontoxique';
		}

		//on affiche
		document.querySelector("#ResultatPartiel2").style.display = "block";

	} 
    else {
		//sinon
		//on cache la dose relative 2
		document.querySelector("#ResultatPartiel2").style.display = "none";

		//on affiche une suggestion de complément de volume max en placeholder
		// si vol1 déterminé
		if (vol1 != '') {
			var complement = Math.round(volmax2 * (1 - vol1 / volmax1));
			if (complement > 0) {
				document.querySelector('#Volume2').setAttribute('placeholder', String('max. ') + complement);
			} 
            else {
				$('#Volume2').prop("placeholder", '-');
			}
		} 
        else {
			//sinon on réinitialise le placeholder volume2
			document.querySelector('#Volume2').setAttribute('placeholder', '-');
		}
	}

	//si Volume1 et Volume2 choisis
	var dosetot = doserel1 + doserel2;
	if (vol1 != '' && vol2 != '') {
		//on modifie le texte de la dose relative
		var texte = "En supposant la toxicité additive, le mélange est à ";
		texte = texte + dosetot;
		texte = texte + "% de la dose toxique.";
		document.getElementById('ResultatTotal').innerHTML = texte;

		if (dosetot > 100) {
			document.getElementById('ResultatTotal').className = 'dosetoxique';
		} 
        else {
			document.getElementById('ResultatTotal').className = 'dosenontoxique';
		}

		document.querySelector("#ResultatTotal").style.display = "block";

	} 
    else {
		document.querySelector("#ResultatPartiel2").style.display = "none";
	}
}

function desactiver_AL(AL) {
	document.getElementById('blocAL' + AL).style.opacity = 0.5;
	document.getElementById('Produit' + AL).setAttribute("disabled", true);
	document.getElementById('Site' + AL).setAttribute("disabled", true);
	document.getElementById('Concentration' + AL).setAttribute("disabled", true);
}

function toutmasquer() {
	document.querySelector("#Posologie1").style.display = "none";
	document.querySelector("#Concentration1").style.display = "none";
	document.querySelector("#VolumeMax1").style.display = "none";
	
	document.querySelector("#Posologie2").style.display = "none";
	document.querySelector("#Concentration2").style.display = "none";
	document.querySelector("#VolumeMax2").style.display = "none";
	
	document.querySelector("#blocMelangeVolumesDifferents").style.display = "none";
	document.querySelector("#blocMelangeVolumesEgaux").style.display = "none";
	
	document.querySelector("#ResultatPartiel1").style.display = "none";
	document.querySelector("#ResultatPartiel2").style.display = "none";
	document.querySelector("#ResultatTotal").style.display = "none";
}

function reduction_fragile() {
	var DEFAUT = 40;
	var valeur = localStorage.getItem("param_fragile");
	if (valeur == null || valeur == 'null') {
		return DEFAUT;
	} 
    else {
		return valeur
	};

}

function mise_en_place_valeur_fragile() {
	document.getElementById('valeur_fragile').innerHTML = String("Fragile (Dose réduite de ") + reduction_fragile() + "%)";
}

   /* SLIDE UP */
let slideUp = (target, duration=500) => {

	if (window.getComputedStyle(target).display !== 'none') {
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout( () => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			//alert("!");
		}, duration);
	}
}

/* SLIDE DOWN */
let slideDown = (target, duration=500) => {

	if (window.getComputedStyle(target).display === 'none') {
		target.style.removeProperty('display');
		let display = window.getComputedStyle(target).display;
		if (display === 'none') display = 'block';
		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout( () => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
		}, duration);
	}
}

/* TOOGLE */
var slideToggle = (target, duration = 500) => {
	if (window.getComputedStyle(target).display === 'none') {
	  return slideDown(target, duration);
	} else {
	  return slideUp(target, duration);
	}
}

// ** FADE OUT FUNCTION **
function fadeOut(el) {
	if (el.style.opacity != 0){
		el.style.opacity = 1;
		(function fade() {
			if ((el.style.opacity -= .1) < 0) {
				el.style.display = "none";
			} else {
				requestAnimationFrame(fade);
			}
		})();
	}
};

// ** FADE IN FUNCTION **
function fadeIn(el, display = "") {
	if (el.style.opacity != 1){
		el.style.opacity = 0;
		el.style.display = display || "block";
		(function fade() {
			var val = parseFloat(el.style.opacity);
			if (!((val += .1) > 1)) {
				el.style.opacity = val;
				requestAnimationFrame(fade);
			}
		})();
	}
};
