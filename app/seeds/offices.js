import seed from "../helpers/seed";

export const offices = [
  {
    "type": " 'Federal'",
    "name": " 'PresidentNigeria'"
  },
  {
    "type": " 'State'",
    "name": " 'GovernorRivers'"
  },
  {
    "type": " 'Legislative'",
    "name": " 'SenatorAkwaIbomNorth'"
  },
  {
    "type": " 'Legislative'",
    "name": " 'RepresentativeAnambaraFederalConstituencyI'"
  },
  {
    "type": " 'Local Government'",
    "name": " 'ChairmanKosofe'"
  }
];

export const seedOffices= seed('offices',offices)
