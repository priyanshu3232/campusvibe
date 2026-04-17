-- CampusVibe — Seed top colleges
-- Safe to re-run: inserts only if name doesn't already exist.

insert into colleges (name, domains, city, tier) values
  ('IIT Delhi',        array['iitd.ac.in'],                 'New Delhi', 1),
  ('IIT Bombay',       array['iitb.ac.in'],                 'Mumbai',    1),
  ('IIT Madras',       array['iitm.ac.in'],                 'Chennai',   1),
  ('IIT Kanpur',       array['iitk.ac.in'],                 'Kanpur',    1),
  ('IIT Kharagpur',    array['iitkgp.ac.in'],               'Kharagpur', 1),
  ('IIT Hyderabad',    array['iith.ac.in'],                 'Hyderabad', 1),
  ('IIT Guwahati',     array['iitg.ac.in'],                 'Guwahati',  1),
  ('IIT Roorkee',      array['iitr.ac.in'],                 'Roorkee',   1),
  ('BITS Pilani',      array['pilani.bits-pilani.ac.in'],   'Pilani',    1),
  ('BITS Goa',         array['goa.bits-pilani.ac.in'],      'Goa',       1),
  ('BITS Hyderabad',   array['hyderabad.bits-pilani.ac.in'],'Hyderabad', 1),
  ('VIT Vellore',      array['vitstudent.ac.in'],           'Vellore',   2),
  ('SRM Institute',    array['srmist.edu.in'],              'Chennai',   2),
  ('Manipal Institute',array['learner.manipal.edu'],        'Manipal',   2),
  ('DTU',              array['dtu.ac.in'],                  'New Delhi', 2),
  ('NSUT',             array['nsut.ac.in'],                 'New Delhi', 2),
  ('IIIT Delhi',       array['iiitd.ac.in'],                'New Delhi', 1)
on conflict do nothing;
