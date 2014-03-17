<?php

return array(
	'gebruiker' => array(
		'id',
		'borg_betaald',
		'huisnummer',
		'huisnummer_toevoeging',
		'voornaam',
		'tussenvoegsel',
		'achternaam',
		'telefoonnummer',
		'geboorte_datum',
		'actie_id',
		'postcode_id',
	),
	'actie' => array(
		'id',
		'borg',
		'borg_totaal',
		'initiatiefnemer_id',
		'eind_datum',
		'start_datum',
		'wijk_id',
	),
	'wijk' => array(
		'id',
		'target',
		'actie_duur',
		'beschikbaar', 
		'aantal_huishoudens',
	),
	'postcode' => array(
		'id',
		'plaats',
		'gemeente',
		'postcode',
		'wijk_id',
	),
	'media' => array(
		'id',
		'reported_count',
		'type',
		'url',
		'gebruiker_id',
		'actie_id',
	),
	'buddy' => array(
		'gebruiker_id',
		'tijd_vanaf',
		'tijd_tot',
		'range',
		'contact_tel',
		'locatie',
	),
	'interesse' => array(
		'datum',
		'gebruiker_id',
	),
	'account' => array(
		'email',
		'gebruiker_id',
		'wachtwoord',
		'foto_link',
		'validated',
		'accountLevel_id',
		'validatie_link',
	),
	'accountLevel' => array(
		'id',
		'level',
	),
	'provider' => array(
		'id',
		'naam',
	),
	'provider_pakket' => array(
		'id',
		'prijs_maand',
		'pakket_beschrijving',
		'provider_id',
	)
)