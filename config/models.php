<?php

return array(
	'models' => array(
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
			'shared_info',
		),
		'actie' => array(
			'id',
			'borg',
			'borg_totaal',
			'initiatiefnemer_id',
			'eind_datum' => array(
				'validation' => array('presenceOf')
			),
			'start_datum' => array(
				'validation' => array('presenceOf')
			),
			'wijk_id' => array(
				'validation' => array('presenceOf')
			),
		),
		'wijk' => array(
			'id',
			'target',
			'actie_duur',
			'beschikbaar' => array(
				'validation' => array('presenceOf'),
				'default' => false,
			), 
			'aantal_huishoudens',
		),
		'postcode' => array(
			'id',
			'plaats',
			'gemeente',
			'postcode' => array(
				'validation' => array('presenceOf', 'regex' => array('pattern' => '^[1-9][0-9]{3}\s?[a-zA-Z]{2}$')),
			), 
			'latitude' => array(
				'validation' => array('presenceOf')
			),
			'longitude' => array(
				'validation' => array('presenceOf')
			),
			'wijk_id',
		),
		'media' => array(
			'id',
			'reported_count' => array(
				'default' => 0,
			),
			'type' => array(
				'validation' => array('inclusionIn' => array('domain' => array('video', 'image'))),
			),
			'url',
			'gebruiker_id',
			'actie_id' => array(
				'validation' => array('presenceOf')
			),
		),
		'buddy' => array(
			'gebruiker_id' => array(
				'validation' => array('presenceOf')
			),
			'tijd_vanaf',
			'tijd_tot',
			'range',
			'contact_tel',
			'contact_email' => array(
				'validation' => array('email')
			),
			'locatie',
		),
		'interesse' => array(
			'datum' => array(
				'validation' => array('presenceOf')
			),
			'gebruiker_id' => array(
				'validation' => array('presenceOf')
			),
		),
		'account' => array(
			'email' => array(
				'validation' => array('email', 'presenceOf')
			),
			'gebruiker_id',
			'wachtwoord' => array(
				'validation' => array('presenceOf')
			),
			'foto_link',
			'validated' => array(
				'validation' => array('presenceOf'),
				'default' => false,
			),
			'accountLevel_id' => array(
				'validation' => array('presenceOf')
			),
			'validatie_link',
		),
		'accountLevel' => array(
			'id',
			'level' => array(
				'validation' => array('inclusionIn' => array('domain' => array('user', 'admin', 'buddy'))),
			),
		),
		'provider' => array(
			'id',
			'naam' => array(
				'validation' => array('presenceOf')
			),
			'website_url',
		),
		'provider_pakket' => array(
			'id',
			'prijs_maand',
			'pakket_beschrijving',
			'provider_id' => array(
				'validation' => array('presenceOf')
			),
		)
	),
	'globalConfig' => array(
		'messages' => array(
			'presenceOf' => 'Cannot be null or empty',
			'email' => 'Not a valid email format',
			'regex' => 'Not a valid pattern',
			'inclusionIn' => 'Not a valid value',
		)
	)
)