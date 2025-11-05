import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import locationsData from './data/locations.json';
import './LocationsList.css';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isOpen(open_from, open_to, then_open_from, then_open_to, currentTime) {
  const ct = currentTime;
  function between(time, start, end) {
    return time >= start && time <= end;
  }
  return between(ct, open_from, open_to) || between(ct, then_open_from, then_open_to);
}

function LocationsList() {
  const [userLocation, setUserLocation] = useState(null);
  const [sortedLocations, setSortedLocations] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hh}:${mm}`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation({ latitude: 12.9716, longitude: 77.5946 });
        }
      );
    } else {
      setUserLocation({ latitude: 12.9716, longitude: 77.5946 });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const locationsWithDistance = locationsData.map((loc) => {
        const dist = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          loc.latitude,
          loc.longitude
        );
        return { ...loc, distance: dist.toFixed(2) };
      });
      locationsWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedLocations(locationsWithDistance);
    }
  }, [userLocation]);

  const openGoogleMapsDirections = (loc) => {
    if (userLocation && loc.latitude !== 0 && loc.longitude !== 0) {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${loc.latitude},${loc.longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      window.open(url, '_blank');
    } else if (loc.latitude === 0 || loc.longitude === 0) {
      alert('Location coordinates not available for this place.');
    }
  };

  return (
    <div className="locations-list">
      <div className="list-header">
        <div className="header-info">
          <Clock size={20} />
          <span>Current time: {currentTime}</span>
        </div>
      </div>

      {!userLocation && (
        <div className="loading-state">
          <Navigation size={32} />
          <p>Getting your location...</p>
        </div>
      )}

      {userLocation && (
        <div className="locations-grid">
          {sortedLocations.map((loc) => {
            const open = isOpen(
              loc.open_from,
              loc.open_to,
              loc.then_open_from,
              loc.then_open_to,
              currentTime
            );
            return (
              <div
                key={loc.id}
                className="location-card"
                onClick={() => openGoogleMapsDirections(loc)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header">
                  <div className="location-name">
                    {/* <MapPin size={18} /> */}
                    <div style={{ width: "10vw", height: "10vw", backgroundColor: "#dfdfdf", borderRadius: "50%", border: "2px solid #fff" }}><img style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} src={loc.url || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"} alt="" /></div>
                    <h3>{loc.location}</h3>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <span className={`status-badge ${open ? 'open' : 'closed'}`}>
                      {open ? 'Open' : 'Closed'}
                    </span>
                    <span style={{ textTransform: "capitalize", fontSize: "3.2vw", color: "orangered" }}>{loc.filter}</span>
                  </div>

                </div>
                <div className="card-body">
                  <div className="info-row">

                    <span className="label">Distance</span>
                    <span className="value">{loc.distance} km</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Hours</span>

                    <span className="value hours-text">
                      {`${loc.open_from} - ${loc.open_to}`}
                      {loc.then_open_from !== loc.open_from && (
                        <>, {loc.then_open_from} - {loc.then_open_to}</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LocationsList;
