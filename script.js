$(function(){
  
  mise_en_place();
  creer_evenements(); //créé les liens entre les événements qui modifient le contenu et la fonction mise à jour
  
  });


//ajuste les éléments pour la première utilisation
function mise_en_place()
{
    desactiver_AL("2");
    mise_en_place_valeur_fragile();
    toutmasquer();
}

// à chaque événement, recalcule l'ensemble des éléments de la page
function mise_a_jour()
{
    //met à jour le contenu du bloc 1
    var AL1_f = mise_a_jour_AL("1");
    //met à jour le contenu du bloc 2 (même si désactivé)
    var AL2_f = mise_a_jour_AL("2");

    //si bloc1 complet
    if(AL1_f.complet)
        {
        //activer bloc2
        activer_AL("2");
        //si bloc2 complet
        if(AL2_f.complet)
            {
            //mise à jour addition volumes égaux
            //mise à jour addition volumes différents
            mise_a_jour_volumes_egaux(AL1_f.volmax, AL2_f.volmax);
            mise_a_jour_volumes_differents(AL1_f.volmax, AL2_f.volmax);
                
            //afficher addition volumes égaux
            //afficher addition volumes différents
            afficher_blocs_addition();
            }
        //si bloc2 incomplet
        else{
            //masque addition volumes égaux
            //masquer addition volumes différents
            masquer_blocs_addition();
            }
        }
    //si bloc1 incomplet
    else{
            //masquer addition volumes égaux
            //masquer addition volumes différents
            masquer_blocs_addition();
            //desactiver bloc2
            desactiver_AL(2);
        }
    


}

function mise_a_jour_AL(AL)
{
    var produit = $('#Produit'.concat(AL)).val();
    var site = $('#Site'.concat(AL)).val();
    var poids = $('#poids').val();
    var poso = Math.round(poids*posologie(produit, site)); 
    var poso_max = posologie_max(produit, site);
    var fragile = $('#fragile').is(':checked');
    var concentration = $('#Concentration'.concat(AL)).val();
    
    //on borne la poso si besoin
    if (poso_max != 0 && poso > poso_max)
    {poso = poso_max;}
    
    //on réduit la dose si besoin
    if(fragile)
    {poso = Math.round((1-reduction_fragile()/100)*poso)};
    
    //calcul du volume
    var volume = Math.round(poso/concentration);
    //si produit choisi ET site choisi
    if (produit != 'rien' && site != 'rien')
    {
        if(poids != '')//si poids déterminé
        {
            //on affiche la dose max en mg
            $('#Posologie'.concat(AL)).html('La dose maximale à ne pas dépasser est de <span class="resultat" >'.concat(poso).concat(" mg.</span>"));
            $('#Posologie'.concat(AL)).show();
            //on affiche le choix de la concentration
            $('#Concentration'.concat(AL)).show();
            //si concentration non choisie
            if(concentration == "rien") {
                //on masque le volume max
                $('#VolumeMax'.concat(AL)).hide();
            }
            else
            {//si concentration choisie
                
                //on affiche le volume max en ml
                $('#VolumeMax'.concat(AL)).html('Pour cette concentration, le volume maximal recommandé est de <span class="resultat">'.concat(volume).concat(" ml.</span>"));
                $('#VolumeMax'.concat(AL)).show();
                return {complet : true, volmax:volume};
            }
        }
        else//si poids non choisi
        {
            //on affiche la dose max en mg/kg  
            var texte = 'La dose maximale est de <span class="resultat">'.concat(posologie(produit, site)).concat(" mg/kg </span>");
            if(poso_max != 0){texte = texte.concat(' sans dépasser <span class="resultat">').concat(poso_max).concat(' mg</span>');}
            texte = texte.concat(".")
            $('#Posologie'.concat(AL)).html(texte);
            $('#Posologie'.concat(AL)).show();
            $('#Concentration'.concat(AL)).hide();
            $('#VolumeMax'.concat(AL)).hide();
        }
    } else 
    {
        //on masque la dose max en mg/kg ou en mg
        $('#Posologie'.concat(AL)).hide();
        $('#Concentration'.concat(AL)).hide();
        $('#VolumeMax'.concat(AL)).hide();
    }
    return { complet:false, volmax:0}; //on indique que le formulaire est incomplet
    
}


function posologie(produit, site)
{
    //en mg/kg
    var posologie_membre_superieur = 
        {
            "Lidocaine":6,
            "Lidocaine_adre":7,
            "Mepivacaine":6,
            "Ropivacaine":3,
            "Bupivacaine":2.5,
            "Bupivacaine_adre":2.5,
            "Levobupivacaine":2.5,
        };

    var posologie_membre_inferieur = 
        {
            "Lidocaine":7,
            "Lidocaine_adre":10,
            "Mepivacaine":6,
            "Ropivacaine":4,
            "Bupivacaine":2.5,
            "Bupivacaine_adre":2.5,
            "Levobupivacaine":2.5,
        };
    
    if(site == "Membre_superieur") {
        
        var valeur_modifiee = localStorage.getItem(String("relatif_ms_").concat(produit));
        if (valeur_modifiee != null)
            {
                return valeur_modifiee;
            }
        return posologie_membre_superieur[produit];
    }
    
    else if(site == "Membre_inferieur"){ 
        var valeur_modifiee = localStorage.getItem(String("relatif_mi_").concat(produit));
        if (valeur_modifiee != null)
            {
                return valeur_modifiee;
            }
        return posologie_membre_inferieur[produit];
    }
    
    return 0;
}

function posologie_max(produit, site)
{
    //en mg
        var posologie_max_membre_superieur = 
        {
            "Lidocaine":0,
            "Lidocaine_adre":500,
            "Mepivacaine":400,
            "Ropivacaine":225,
            "Bupivacaine":0,
            "Bupivacaine_adre":150,
            "Levobupivacaine":150,
        };

    var posologie_max_membre_inferieur = 
        {
            "Lidocaine":0,
            "Lidocaine_adre":700,
            "Mepivacaine":400,
            "Ropivacaine":300,
            "Bupivacaine":0,
            "Bupivacaine_adre":180,
            "Levobupivacaine":150,
        };
    
    if(site == "Membre_superieur") {
        var valeur_modifiee = localStorage.getItem(String("absolu_ms_").concat(produit));
        if (valeur_modifiee != null)
            {
                return valeur_modifiee;
            }
        return posologie_max_membre_superieur[produit]
    }
    else if(site == "Membre_inferieur") {
        var valeur_modifiee = localStorage.getItem(String("relatif_mi_").concat(produit));
        if (valeur_modifiee != null)
            {
                return valeur_modifiee;
            }
        return posologie_max_membre_inferieur[produit];}
    
    return 0;
    
}

function afficher_blocs_addition()
{
    $('#blocMelangeVolumesDifferents').slideDown();
    $('#blocMelangeVolumesEgaux').slideDown();
}


function masquer_blocs_addition()
{
    $('#blocMelangeVolumesDifferents').slideUp(); 
    $('#blocMelangeVolumesEgaux').slideUp(); 
}

function creer_evenements()
{
    $("#poids").change(function(){mise_a_jour();});
    $("#fragile").change(function(){mise_a_jour();});
    
    $("#Produit1").change(function(){
        $('#Concentration1 option:eq(0)').prop('selected', true);
        mise_a_jour();});
    $("#Site1").change(function(){mise_a_jour();});
    $("#Concentration1").change(function(){mise_a_jour();});
    $("#Volume1").change(function(){mise_a_jour();});

    $("#Produit2").change(function(){
        $('#Concentration2 option:eq(0)').prop('selected', true);
        mise_a_jour();});
    $("#Site2").change(function(){mise_a_jour();});
    $("#Concentration2").change(function(){mise_a_jour();});
    $("#Volume2").change(function(){mise_a_jour();});
    $("#banniere").click(function(){location.reload();});
}

function activer_AL(AL)
{
    $('#blocAL'.concat(AL)).fadeTo("normal", 1);
    $('#Produit'.concat(AL)).removeAttr("disabled");
    $('#Site'.concat(AL)).removeAttr("disabled");
    $('#Concentration'.concat(AL)).removeAttr("disabled");
}

function mise_a_jour_volumes_egaux(vol1, vol2)
{
$("#resultatMelangeVolumesEgaux").html(Math.round((vol1+vol2)/2).toString().concat(" ml"));
}

function mise_a_jour_volumes_differents(volmax1, volmax2)
{
    
    var vol1 = $("#Volume1").val();
    var vol2 = $("#Volume2").val();
    var doserel1 = Math.round(vol1/volmax1*100);
    var doserel2 = Math.round(vol2/volmax2*100);
    //on actualise les titres des anesthésiques locaux
    $("#LibelleProduit1").html($("#Produit1 option:selected").text().concat(" (").concat($("#Concentration1 option:selected").text().concat(")")));
    $("#LibelleProduit2").html($("#Produit2 option:selected").text().concat(" (").concat($("#Concentration2 option:selected").text().concat(")")));
    
    //si Volume1 choisi
    if(vol1 != '')
        {
            //on modifie le texte de la dose relative
            var texte = "Ce volume représente ";
            texte = texte.concat(doserel1);
            texte = texte.concat("% de la dose toxique.");
            $("#ResultatPartiel1").html(texte);
            
            //on change la couleur si toxique ou non
            if(doserel1 > 100){ $("#ResultatPartiel1").prop("class", "dosetoxique");}
            else {$("#ResultatPartiel1").prop("class", "dosenontoxique");}
            
            //on affiche
            $("#ResultatPartiel1").show();

        }
    else{
    //sinon
        //on cache la dose relative 1
        $("#ResultatPartiel1").hide();
        

        // si vol2 déterminé
        if (vol2 !='') 
            {
            //on affiche une suggestion de complément de volume max en placeholder
            var complement = Math.round(volmax1*(1-vol2/volmax2));
            $('#Volume1').prop("placeholder", String('max. ').concat(complement));
            if (complement > 0){$('#Volume1').prop("placeholder", String('max. ').concat(complement));}
            else {$('#Volume1').prop("placeholder", '-');}
            }
        else{
            //sinon on réinitialise le placeholder volume2
            $('#Volume1').prop("placeholder", String('Volume'));
            }
        }
    
    //si Volume2 choisi
    if(vol2 != '')
        {
            //on modifie le texte de la dose relative
            var texte = "Ce volume représente ";
            texte = texte.concat(doserel2);
            texte = texte.concat("% de la dose toxique.");
            $("#ResultatPartiel2").html(texte);
            
            //on change la couleur si toxique ou non
            if(doserel2 > 100){ $("#ResultatPartiel2").prop("class", "dosetoxique");}
            else {$("#ResultatPartiel2").prop("class", "dosenontoxique");}
            
            //on affiche
            $("#ResultatPartiel2").show();
            
        }
    else{
    //sinon
        //on cache la dose relative 2
        $("#ResultatPartiel2").hide();
        //on affiche une suggestion de complément de volume max en placeholder
        
        // si vol1 déterminé
        if (vol1 !='') 
            {
            var complement = Math.round(volmax2*(1-vol1/volmax1));
            if (complement > 0){$('#Volume2').prop("placeholder", String('max. ').concat(complement));}
            else {$('#Volume2').prop("placeholder", '-');}
        }
        else{
            //sinon on réinitialise le placeholder volume1
            $('#Volume2').prop("placeholder", String('Volume'));
            }
        }
    
    //si Volume1 et Volume2 choisis
    var dosetot = doserel1 + doserel2;
    if(vol1 != '' && vol2 != '')
        {
            //on modifie le texte de la dose relative
            var texte = "En supposant la toxicité additive, le mélange est à ";
            texte = texte.concat(dosetot);
            texte = texte.concat("% de la dose toxique.");
            $("#ResultatTotal").html(texte);
            
            if (dosetot > 100){ $("#ResultatTotal").prop("class", "dosetoxique");}
            else {$("#ResultatTotal").prop("class", "dosenontoxique");}
            
            $("#ResultatTotal").show();
            
        }
    else{
        $("#ResultatTotal").hide();
        }
}

function desactiver_AL(AL)
{
    $('#blocAL'.concat(AL)).fadeTo(1, 0.5);
    $('#Produit'.concat(AL)).prop("disabled", true);
    $('#Site'.concat(AL)).prop("disabled", true);
    $('#Concentration'.concat(AL)).prop("disabled", true);
}

function toutmasquer()
{
    $("#Posologie1").hide();
    $("#Concentration1").hide();
    $("#VolumeMax1").hide();
    
    $("#Posologie2").hide();
    $("#Concentration2").hide();
    $("#VolumeMax2").hide();
    
    $('#blocMelangeVolumesDifferents').hide(); 
    $('#blocMelangeVolumesEgaux').hide(); 
    
    $("#ResultatPartiel1").hide();
    $("#ResultatPartiel2").hide();
    $("#ResultatTotal").hide();
}

function reduction_fragile()
{
    var DEFAUT = 40;
    var valeur = localStorage.getItem("param_fragile");
    if (valeur == null || valeur =='null') { return DEFAUT; }
    else {return valeur};
    
}

function mise_en_place_valeur_fragile()
{
    $("#valeur_fragile").html(String("Fragile (Dose réduite de ").concat(reduction_fragile()).concat("%)"));
}
/*
notes 
changements de nomenclature
AL1-AL2 ==> Produit1-Produit2
siteAL1 ==> Site1
concentrationAL1 ==> Concentration1
volumesouhaiteAL1 ==> Volume1
*/