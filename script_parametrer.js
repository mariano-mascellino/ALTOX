$(function() {
	mise_en_place();
	$("#banniere").click(function() {
		location.assign("index.html")
	});
});

//génère le contenu de la page
function mise_en_place() {
	//mise en place du bloc paramfragile
	//récupération de la valeur de modification si existe ...
	var param_fragile = localStorage.getItem('param_fragile');
	var DEFAUT = 40;
	if (param_fragile == 'null' || param_fragile == null || param_fragile == DEFAUT) {
		$("#valeur_fragile").val(DEFAUT);
	} 
    else {
		$("#valeur_fragile").val(param_fragile);
	}
	actualiser_paramfragile(DEFAUT);
	//met en place les événements
	$("#valeur_fragile").change(function() {
		modifier_paramfragile(DEFAUT);
	});

	//mise en place des blocs paramproduit
	//recupère la liste des modifications
	//recupère la liste des valeurs par défaut
	var posologies_ms_def = posologies_ms_defaut();
	var posologies_max_ms_def = posologies_max_ms_defaut();
	var posologies_mi_def = posologies_mi_defaut();
	var posologies_max_mi_def = posologies_max_mi_defaut();

	for (produit_ID in libelles_produits()) {
		//tant que PRODUITS
		var contenu = '';

		//on définit le nom du produit et son identifiant
		var produit = libelles_produits()[produit_ID];
		//var produit_ID = posologie_ms;

		//on récupère les modifications
		var modif_relatif_ms = localStorage.getItem(String("relatif_ms_").concat(produit_ID));
		var modif_absolu_ms = localStorage.getItem(String("absolu_ms_").concat(produit_ID));
		var modif_relatif_mi = localStorage.getItem(String("relatif_mi_").concat(produit_ID));
		var modif_absolu_mi = localStorage.getItem(String("absolu_mi_").concat(produit_ID));

		//on affecte les valeurs par défaut ou modifiées au MS
		//var is_defaut_relatif_ms = true;
		var val_defaut_relatif_ms = posologies_ms_def[produit_ID];
		// var is_defaut_absolu_ms = true;
		var val_defaut_absolu_ms = posologies_max_ms_def[produit_ID];
		var has_defaut_absolu_ms = true;

		//on affecte les valeurs par défaut ou modifiées au MS
		//var is_defaut_relatif_mi = true;
		var val_defaut_relatif_mi = posologies_mi_def[produit_ID];
		//var is_defaut_absolu_mi = true;
		var val_defaut_absolu_mi = posologies_max_mi_def[produit_ID];
		var has_defaut_absolu_mi = true;

		modif_relatif_ms = modif_relatif_ms == null || modif_relatif_ms == 'null' ? null : parseNumberOrDefault(modif_relatif_ms, val_defaut_relatif_ms);
		modif_absolu_ms = modif_absolu_ms == null || modif_absolu_ms == 'null' ? null : parseNumberOrDefault(modif_absolu_ms, val_defaut_absolu_ms);
		modif_relatif_mi = modif_relatif_mi == null || modif_relatif_mi == 'null' ? null : parseNumberOrDefault(modif_relatif_mi, val_defaut_relatif_mi);
		modif_absolu_mi = modif_absolu_mi == null || modif_absolu_mi == 'null' ? null : parseNumberOrDefault(modif_absolu_mi, val_defaut_absolu_mi);

		//on génère le bloc
		$(".container").append(generer_bloc_param_produit(
			produit, produit_ID,
			modif_relatif_ms, val_defaut_relatif_ms, //MS relatif
			modif_absolu_ms, val_defaut_absolu_ms, //MS absolu
			modif_relatif_mi, val_defaut_relatif_mi, //MI relatif
			modif_absolu_mi, val_defaut_absolu_mi)); //MI absolu

		creer_evenement_bloc_param_produit(produit_ID);
	}


	$('.container').append($('footer'));
	//reinitialisation
	$("#reinitialiser").click(function() {
		reinitialiser();
	});
}

//change la valeur de paramètre fragile lorsque modifié
function modifier_paramfragile(defaut) {
	var valeur_souhaitee = $("#valeur_fragile").val();
	if (valeur_souhaitee == defaut) {
		localStorage.setItem('param_fragile', null);
	} 
    else if (valeur_souhaitee != null) {
		localStorage.setItem('param_fragile', valeur_souhaitee);
	} 
    else {
		localStorage.setItem('param_fragile', null);
	}

	actualiser_paramfragile(defaut);
}

function actualiser_paramfragile(defaut) {
	if ($("#valeur_fragile").val() == defaut) {
		$("#defaut_fragile").hide();
	} 
    else {
		$("#defaut_fragile").html(String('Valeur par défaut ').concat(defaut).concat("%"));
		$("#defaut_fragile").show();
	}
}
//change la valeur de parametre produit lorsque modifié
function modifier_paramproduit(id_produit) {
	//identifie le bloc
	//récupère les valeurs
	//modifie si différente
	//actualise la page
}

function reinitialiser() {
	localStorage.clear();
	location.reload();

}

function generer_bloc_param_produit(produit, produit_ID,
	modif_relatif_ms, val_defaut_relatif_ms,
	modif_absolu_ms, val_defaut_absolu_ms, modif_relatif_mi, val_defaut_relatif_mi,
	modif_absolu_mi, val_defaut_absolu_mi) {
	//indicateurs si valeur a été modifiée initialement
	var is_defaut_relatif_ms = modif_relatif_ms == null || modif_relatif_ms == val_defaut_relatif_ms;
	var is_defaut_absolu_ms = modif_absolu_ms == null || modif_absolu_ms == val_defaut_absolu_ms;
	var is_defaut_relatif_mi = modif_relatif_mi == null || modif_relatif_mi == val_defaut_relatif_mi;
	var is_defaut_absolu_mi = modif_absolu_mi == null || modif_absolu_mi == val_defaut_absolu_mi;

	//valeurs qui seront affichées, réglées par défaut puis modifiées
	var val_relatif_ms = val_defaut_relatif_ms;
	var val_absolu_ms = val_defaut_absolu_ms;
	var val_relatif_mi = val_defaut_relatif_mi;
	var val_absolu_mi = val_defaut_absolu_mi;

	var contenu = '';

	contenu = contenu.concat('<div class = "paramproduit"><h3>').concat(produit).concat('</h3>');
	contenu = contenu.concat('<h4>Membre supérieur</h4> <h6 class="');

	if (!is_defaut_relatif_ms) {
		contenu = contenu.concat(' modifie');
		val_relatif_ms = modif_relatif_ms;
	}

	contenu = contenu.concat('" id="dose_relative_MS_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('">Dose maximale relative');

	if (is_defaut_relatif_ms) {
		contenu = contenu.concat(' (par défaut)');
	} 
    else {
		contenu = contenu.concat(' (modifiée)');
	}

	contenu = contenu.concat('</h6>');

	if (!is_defaut_relatif_ms) {
		contenu = contenu.concat('<p id="defaut_relative_MS_');
		contenu = contenu.concat(produit_ID);
		contenu = contenu.concat('"> Valeur par défaut : ');
		contenu = contenu.concat(val_defaut_relatif_ms);
		contenu = contenu.concat(' mg/kg</p> ');
	}
	contenu = contenu.concat('<select id="valeur_relative_MS_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('" name="valeur_relative_PRODUIT">');

	//boucle
	for (var i = 0.5; i <= 10; i += 0.5) {
		contenu = contenu.concat('<option value="');
		contenu = contenu.concat(i);
		if (i == val_relatif_ms) {
			contenu = contenu.concat('"selected="selected')
		};
		contenu = contenu.concat('">');
		contenu = contenu.concat(i);
		contenu = contenu.concat(' mg/kg</option>');
	}

	contenu = contenu.concat('</select>');

	contenu = contenu.concat('<h6 class="');
	if (!is_defaut_absolu_ms) {
		contenu = contenu.concat('modifie');
		val_absolu_ms = modif_absolu_ms;
	}

	contenu = contenu.concat('" id="dose_absolue_MS_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('">Dose maximale absolue');

	if (is_defaut_absolu_ms) {
		contenu = contenu.concat(' (par défaut)');
	} 
    else {
		contenu = contenu.concat(' (modifiée)');
	}

	contenu = contenu.concat('</h6>');

	if (!is_defaut_absolu_ms) {
		contenu = contenu.concat('<p id="defaut_absolu_MS_');
		contenu = contenu.concat(produit_ID);
		if (val_defaut_absolu_ms != 0) {
			contenu = contenu.concat('"> Valeur par défaut : ');
			contenu = contenu.concat(val_defaut_absolu_ms);
			contenu = contenu.concat(' mg</p> ');
		} 
        else {
			contenu = contenu.concat('"> Valeur par défaut : aucune</p>');
		}
	}

	contenu = contenu.concat('<select id="valeur_absolue_MS_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('" name="valeur_absolue_MS_PRODUIT">');

	//pour la valeur 0 = pas de valeur absolue définie
	contenu = contenu.concat('<option value="');
	contenu = contenu.concat(0);
	if (0 == val_absolu_ms) {
		contenu = contenu.concat('"selected="selected')
	};
	contenu = contenu.concat('">');
	contenu = contenu.concat("Aucune </option>");

	//boucle
	for (var i = 20; i <= 1000; i += 5) {
		contenu = contenu.concat('<option value="');
		contenu = contenu.concat(i);
		if (i == val_absolu_ms) {
			contenu = contenu.concat('"selected="selected')
		};
		contenu = contenu.concat('">');
		contenu = contenu.concat(i);
		contenu = contenu.concat(' mg</option>');
	}

	contenu = contenu.concat('</select>');

	//membre inf
	contenu = contenu.concat('<h4 class="mt-2 mb-0">Membre inférieur</h4><h6 class=" ');

	if (!is_defaut_relatif_mi) {
		contenu = contenu.concat(' modifie');
		val_relatif_mi = modif_relatif_mi;
	}

	contenu = contenu.concat('" id="dose_relative_MI_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('">Dose maximale relative');

	if (is_defaut_relatif_mi) {
		contenu = contenu.concat(' (par défaut)');
	} 
    else {
		contenu = contenu.concat(' (modifiée)');
	}

	contenu = contenu.concat('</h6>');

	if (!is_defaut_relatif_mi) {
		contenu = contenu.concat('<p id="defaut_relative_MI_');
		contenu = contenu.concat(produit_ID);
		contenu = contenu.concat('"> Valeur par défaut : ');
		contenu = contenu.concat(val_defaut_relatif_mi);
		contenu = contenu.concat(' mg/kg</p> ');
	}

	contenu = contenu.concat('<div><select id="valeur_relative_MI_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('" name="valeur_relative_PRODUIT">');

	//boucle
	for (var i = 0.5; i <= 10; i += 0.5) {
		contenu = contenu.concat('<option value="');
		contenu = contenu.concat(i);
		if (i == val_relatif_mi) {
			contenu = contenu.concat('"selected="selected')
		};
		contenu = contenu.concat('">');
		contenu = contenu.concat(i);
		contenu = contenu.concat(' mg/kg</option>');
	}

	contenu = contenu.concat('</select></div>');

	contenu = contenu.concat('<h6 class=" ');
	if (!is_defaut_absolu_mi) {
		contenu = contenu.concat(' modifie');
		val_absolu_mi = modif_absolu_mi;
	}

	contenu = contenu.concat('" id="dose_absolue_MI_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('">Dose maximale absolue');

	if (is_defaut_absolu_mi) {
		contenu = contenu.concat(' (par défaut)');
	} 
    else {
		contenu = contenu.concat(' (modifiée)');
	}

	contenu = contenu.concat('</h6>');

	if (!is_defaut_absolu_mi) {
		contenu = contenu.concat('<p id="defaut_absolu_MI_');
		contenu = contenu.concat(produit_ID);
		if (val_defaut_absolu_mi != 0) {
			contenu = contenu.concat('"> Valeur par défaut : ');
			contenu = contenu.concat(val_defaut_absolu_mi);
			contenu = contenu.concat(' mg</p> ');
		} 
        else {
			contenu = contenu.concat('">Valeur par défaut : aucune</p>');
		}
	}

	contenu = contenu.concat('<div><select id="valeur_absolue_MI_');
	contenu = contenu.concat(produit_ID);
	contenu = contenu.concat('" name="valeur_absolue_MI_PRODUIT">');

	//pour la valeur 0 = pas de valeur absolue définie
	contenu = contenu.concat('<option value="');
	contenu = contenu.concat(0);
	if (0 == val_absolu_mi) {
		contenu = contenu.concat('"selected="selected')
	};
	contenu = contenu.concat('">');
	contenu = contenu.concat("Aucune </option>");

	//boucle
	for (var i = 20; i <= 1000; i += 5) {
		contenu = contenu.concat('<option value="');
		contenu = contenu.concat(i);
		if (i == val_absolu_mi) {
			contenu = contenu.concat('"selected="selected')
		};
		contenu = contenu.concat('">');
		contenu = contenu.concat(i);
		contenu = contenu.concat(' mg</option>');
	}

	contenu = contenu.concat('</select></div></div>');

	return contenu;
}

function creer_evenement_bloc_param_produit(produit_ID) {
	$(String("#valeur_relative_MS_").concat(produit_ID)).change(function() {
		bloc_modifie(produit_ID)
	});
	$(String("#valeur_absolue_MS_").concat(produit_ID)).change(function() {
		bloc_modifie(produit_ID)
	});
	$(String("#valeur_relative_MI_").concat(produit_ID)).change(function() {
		bloc_modifie(produit_ID)
	});
	$(String("#valeur_absolue_MI_").concat(produit_ID)).change(function() {
		bloc_modifie(produit_ID)
	});
}

function bloc_modifie(produit_ID) {
	//récupération des valeurs saisies
	var input_dose_relative_ms = parseNumberOrDefault($(String("#valeur_relative_MS_").concat(produit_ID)).val(), NaN);
	var input_dose_absolue_ms = parseNumberOrDefault($(String("#valeur_absolue_MS_").concat(produit_ID)).val(), NaN);
	var input_dose_relative_mi = parseNumberOrDefault($(String("#valeur_relative_MI_").concat(produit_ID)).val(), NaN);
	var input_dose_absolue_mi = parseNumberOrDefault($(String("#valeur_absolue_MI_").concat(produit_ID)).val(), NaN);

	//récupération des valeurs stockées
	var modif_relatif_ms = localStorage.getItem(String("relatif_ms_").concat(produit_ID));
	var modif_absolu_ms = localStorage.getItem(String("absolu_ms_").concat(produit_ID));
	var modif_relatif_mi = localStorage.getItem(String("relatif_mi_").concat(produit_ID));
	var modif_absolu_mi = localStorage.getItem(String("absolu_mi_").concat(produit_ID));

	//récupération des valeurs par défaut
	var def_relatif_ms = posologies_ms_defaut()[produit_ID];
	var def_absolu_ms = posologies_max_ms_defaut()[produit_ID];
	var def_relatif_mi = posologies_mi_defaut()[produit_ID];
	var def_absolu_mi = posologies_max_mi_defaut()[produit_ID];

	modif_relatif_ms = modif_relatif_ms == null || modif_relatif_ms == 'null' ? null : parseNumberOrDefault(modif_relatif_ms, def_relatif_ms);
	modif_absolu_ms = modif_absolu_ms == null || modif_absolu_ms == 'null' ? null : parseNumberOrDefault(modif_absolu_ms, def_absolu_ms);
	modif_relatif_mi = modif_relatif_mi == null || modif_relatif_mi == 'null' ? null : parseNumberOrDefault(modif_relatif_mi, def_relatif_mi);
	modif_absolu_mi = modif_absolu_mi == null || modif_absolu_mi == 'null' ? null : parseNumberOrDefault(modif_absolu_mi, def_absolu_mi);

	//met à jour les paramètres du bloc modifié
	//dose relative ms
	//récupère la valeur dans le champ
	//la compare à la valeur par défaut
	//si c'est la même 
	if (input_dose_relative_ms == def_relatif_ms) {

		//cherche si existe modifiée dans local storage
		//si oui on supprime
		if (modif_relatif_ms != null) {
			//puis on met le titre "par défaut"
			//on masque éventuellement "la mention modifiée"
			localStorage.removeItem(String("relatif_ms_").concat(produit_ID));
		} 
        else {
			//si non on ne fait rien
			// à priori il ne s'est rien passé, on ne change rien
		}
	} 
    else { //si c'est pas la même
		//cherche si modifée dans local storage
		if (modif_relatif_ms != null) {
			//si oui 
			//on compare les valeurs
			if (input_dose_relative_ms == modif_relatif_ms) {
				//identiques = on change rien
			} 
            else {
				//différentes = on supprime et on remplace
				localStorage.setItem(String("relatif_ms_").concat(produit_ID), input_dose_relative_ms)
			}
		} 
        else { //si non 
			localStorage.setItem(String("relatif_ms_").concat(produit_ID), input_dose_relative_ms)
			//on crée une nouvelle valeur modifiée
			//on modifie le titre vers "modifié"
			//on affiche la valeur par défaut
		}
	}

	//dose absolue ms
	if (input_dose_absolue_ms == def_absolu_ms) {

		//cherche si existe modifiée dans local storage
		//si oui on supprime
		if (modif_absolu_ms != null) {
			//puis on met le titre "par défaut"
			//on masque éventuellement "la mention modifiée"
			localStorage.removeItem(String("absolu_ms_").concat(produit_ID));
		} 
        else {
			//si non on ne fait rien
			// à priori il ne s'est rien passé, on ne change rien
		}
	} 
    else { //si c'est pas la même
		//cherche si modifée dans local storage
		if (modif_absolu_ms != null) {
			//si oui 
			//on compare les valeurs
			if (input_dose_absolue_ms == modif_absolu_ms) {
				//identiques = on change rien
			} else {
				//différentes = on supprime et on remplace
				localStorage.setItem(String("absolu_ms_").concat(produit_ID), input_dose_absolue_ms)
			}
		} 
        else { //si non 
			localStorage.setItem(String("absolu_ms_").concat(produit_ID), input_dose_absolue_ms)
			//on crée une nouvelle valeur modifiée
			//on modifie le titre vers "modifié"
			//on affiche la valeur par défaut
		}
	}

	//dose relative mi
	//récupère la valeur dans le champ
	//la compare à la valeur par défaut
	//si c'est la même 
	if (input_dose_relative_mi == def_relatif_mi) {

		//cherche si existe modifiée dans local storage
		//si oui on supprime
		if (modif_relatif_mi != null) {
			//puis on met le titre "par défaut"
			//on masque éventuellement "la mention modifiée"
			localStorage.removeItem(String("relatif_mi_").concat(produit_ID));
		} 
        else {
			//si non on ne fait rien
			// à priori il ne s'est rien passé, on ne change rien
		}
	} 
    else { //si c'est pas la même
		//cherche si modifée dans local storage
		if (modif_relatif_mi != null) {
			//si oui 
			//on compare les valeurs
			if (input_dose_relative_mi == modif_relatif_mi) {
				//identiques = on change rien
			} 
            else {
				//différentes = on supprime et on remplace
				localStorage.setItem(String("relatif_mi_").concat(produit_ID), input_dose_relative_mi)
			}
		} 
        else { //si non 
			localStorage.setItem(String("relatif_mi_").concat(produit_ID), input_dose_relative_mi)
			//on crée une nouvelle valeur modifiée
			//on modifie le titre vers "modifié"
			//on affiche la valeur par défaut
		}
	}

	//dose absolue mi
	if (input_dose_absolue_mi == def_absolu_mi) {

		//cherche si existe modifiée dans local storage
		//si oui on supprime
		if (modif_absolu_mi != null) {
			//puis on met le titre "par défaut"
			//on masque éventuellement "la mention modifiée"
			localStorage.removeItem(String("absolu_mi_").concat(produit_ID));
		} 
        else {
			//si non on ne fait rien
			// à priori il ne s'est rien passé, on ne change rien
		}
	} 
    else { //si c'est pas la même
		//cherche si modifée dans local storage
		if (modif_absolu_mi != null) {
			//si oui 
			//on compare les valeurs
			if (input_dose_absolue_mi == modif_absolu_mi) {
				//identiques = on change rien
			} 
            else {
				//différentes = on supprime et on remplace
				localStorage.setItem(String("absolu_mi_").concat(produit_ID), input_dose_absolue_mi)
			}
		} 
        else { //si non 
			localStorage.setItem(String("absolu_mi_").concat(produit_ID), input_dose_absolue_mi)
			//on crée une nouvelle valeur modifiée
			//on modifie le titre vers "modifié"
			//on affiche la valeur par défaut
		}
	}
	actualiser_bloc(produit_ID);
}

function actualiser_bloc(produit_ID) {
	var def_relatif_ms = posologies_ms_defaut()[produit_ID];
	var def_absolu_ms = posologies_max_ms_defaut()[produit_ID];
	var def_relatif_mi = posologies_mi_defaut()[produit_ID];
	var def_absolu_mi = posologies_max_mi_defaut()[produit_ID];

	var modif_relatif_ms = localStorage.getItem(String("relatif_ms_").concat(produit_ID));
	var modif_absolu_ms = localStorage.getItem(String("absolu_ms_").concat(produit_ID));
	var modif_relatif_mi = localStorage.getItem(String("relatif_mi_").concat(produit_ID));
	var modif_absolu_mi = localStorage.getItem(String("absolu_mi_").concat(produit_ID));

	var is_modifie_relatif_ms = modif_relatif_ms != null && modif_relatif_ms != 'null';
	var is_modifie_absolu_ms = modif_absolu_ms != null && modif_absolu_ms != 'null';
	var is_modifie_relatif_mi = modif_relatif_mi != null && modif_relatif_mi != 'null';
	var is_modifie_absolu_mi = modif_absolu_mi != null && modif_absolu_mi != 'null';

	mettre_a_jour_affichage_dose({
		produit_ID: produit_ID,
		suffix: "MS",
		type: "relative",
		is_modifie: is_modifie_relatif_ms,
		valeur_defaut: def_relatif_ms,
		unite: "mg/kg"
	});

	mettre_a_jour_affichage_dose({
		produit_ID: produit_ID,
		suffix: "MS",
		type: "absolue",
		is_modifie: is_modifie_absolu_ms,
		valeur_defaut: def_absolu_ms,
		unite: "mg"
	});

	mettre_a_jour_affichage_dose({
		produit_ID: produit_ID,
		suffix: "MI",
		type: "relative",
		is_modifie: is_modifie_relatif_mi,
		valeur_defaut: def_relatif_mi,
		unite: "mg/kg"
	});

	mettre_a_jour_affichage_dose({
		produit_ID: produit_ID,
		suffix: "MI",
		type: "absolue",
		is_modifie: is_modifie_absolu_mi,
		valeur_defaut: def_absolu_mi,
		unite: "mg"
	});
}

function mettre_a_jour_affichage_dose(options) {
	var base_label = options.type == "relative" ? "Dose maximale relative" : "Dose maximale absolue";
	var header_id = options.type == "relative"
		? String("#dose_relative_").concat(options.suffix).concat("_").concat(options.produit_ID)
		: String("#dose_absolue_").concat(options.suffix).concat("_").concat(options.produit_ID);

	var defaut_id = options.type == "relative"
		? String("#defaut_relative_").concat(options.suffix).concat("_").concat(options.produit_ID)
		: String("#defaut_absolu_").concat(options.suffix).concat("_").concat(options.produit_ID);

	var header = $(header_id);
	if (options.is_modifie) {
		header.addClass("modifie");
		header.text(base_label.concat(" (modifiée)"));
		ajouter_ou_mettre_a_jour_defaut(defaut_id, header_id, options.valeur_defaut, options.unite);
	} 
    else {
		header.removeClass("modifie");
		header.text(base_label.concat(" (par défaut)"));
		$(defaut_id).remove();
	}
}

function ajouter_ou_mettre_a_jour_defaut(defaut_id, header_id, valeur_defaut, unite) {
	var texte_defaut = " Valeur par défaut : ";
	if (valeur_defaut === 0 && unite === "mg") {
		texte_defaut = texte_defaut.concat("aucune");
	} 
    else {
		texte_defaut = texte_defaut.concat(valeur_defaut).concat(" ").concat(unite);
	}

	if ($(defaut_id).length > 0) {
		$(defaut_id).text(texte_defaut);
	} 
    else {
		$(String('<p id="').concat(defaut_id.slice(1)).concat('">').concat(texte_defaut).concat("</p>"))
			.insertAfter($(header_id));
	}
}
