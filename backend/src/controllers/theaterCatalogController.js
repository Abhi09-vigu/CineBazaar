import TheaterCatalog from '../models/TheaterCatalog.js';
import { rawTheaters } from '../data/theaters.seed.js';

export const listTheaterCatalog = async (req, res) => {
  const {
    q,
    city,
    state,
    brand,
    minScreens,
    maxScreens,
    limit = 100,
    skip = 0
  } = req.query;

  const where = {};
  if (city) where.city = city;
  if (state) where.state = state;
  if (brand) where.brand = brand;
  if (minScreens) where.screens = { ...(where.screens || {}), $gte: Number(minScreens) };
  if (maxScreens) where.screens = { ...(where.screens || {}), $lte: Number(maxScreens) };
  if (q) {
    const rx = new RegExp(q, 'i');
    where.$or = [
      { name: rx },
      { city: rx },
      { area: rx },
      { address: rx },
      { state: rx },
      { brand: rx }
    ];
  }

  const lim = Math.max(1, Math.min(500, Number(limit)));
  const sk = Math.max(0, Number(skip));

  const data = await TheaterCatalog.find(where).sort({ city: 1, brand: 1, name: 1 }).skip(sk).limit(lim);
  res.json(data);
};

// Minimal view directly from seed file: name + location (area, city)
export const listTheaterNamesLocations = async (_req, res) => {
  const data = rawTheaters.map(t => ({
    name: t.name,
    location: t.area ? `${t.area}, ${t.city}` : t.city
  }));
  res.json(data);
};
