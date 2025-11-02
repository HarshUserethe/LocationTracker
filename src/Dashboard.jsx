import React, { useEffect, useState } from 'react';
import { Save, Edit2, X, Plus, Download, MapPin } from 'lucide-react';
import storedData from './data/locations.json';
import './Dashboard.css';

function Dashboard() {
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setLocations(JSON.parse(JSON.stringify(storedData)));
  }, []);

  function addNew() {
    const newLoc = {
      id: Date.now(),
      location: '',
      longitude: '',
      latitude: '',
      open_from: '00:00',
      open_to: '00:00',
      then_open_from: '00:00',
      then_open_to: '00:00',
      isNew: true,
    };
    setLocations([newLoc, ...locations]);
    setEditingId(newLoc.id);
    setEditData(newLoc);
  }

  function startEdit(location) {
    setEditingId(location.id);
    setEditData({ ...location });
  }

  function cancelEdit() {
    if (editData.isNew) {
      setLocations(locations.filter((loc) => loc.id !== editingId));
    }
    setEditingId(null);
    setEditData({});
  }

  function saveEdit() {
    const updated = locations.map((loc) =>
      loc.id === editingId ? { ...editData, isNew: false } : loc
    );
    setLocations(updated);
    setEditingId(null);
    setEditData({});
  }

  function updateEditField(field, value) {
    setEditData({ ...editData, [field]: value });
  }

  function deleteLocation(id) {
    if (window.confirm('Delete this location?')) {
      setLocations(locations.filter((loc) => loc.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditData({});
      }
    }
  }

  function saveToFile() {
    const exportData = locations.map(({ isNew, ...rest }) => rest);
    const fileData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'locations.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-actions">
        <button onClick={addNew} className="btn btn-primary">
          <Plus size={18} /> Add Location
        </button>
        <button onClick={saveToFile} className="btn btn-secondary">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="locations-table-container">
        {locations.map((loc) => {
          const isEditing = editingId === loc.id;
          const data = isEditing ? editData : loc;

          return (
            <div key={loc.id} className={`table-card ${isEditing ? 'editing' : ''}`}>
              <div className="table-card-header">
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateEditField('location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Location name"
                  className="location-input"
                />
                <div className="card-actions">
                  {isEditing ? (
                    <>
                      <button onClick={saveEdit} className="btn-icon btn-success">
                        <Save size={16} />
                      </button>
                      <button onClick={cancelEdit} className="btn-icon btn-danger">
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(loc)} className="btn-icon btn-edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteLocation(loc.id)} className="btn-icon btn-danger">
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="table-card-body">
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={data.longitude}
                    onChange={(e) => updateEditField('longitude', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={data.latitude}
                    onChange={(e) => updateEditField('latitude', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Open From</label>
                  <input
                    type="time"
                    value={data.open_from}
                    onChange={(e) => updateEditField('open_from', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Open To</label>
                  <input
                    type="time"
                    value={data.open_to}
                    onChange={(e) => updateEditField('open_to', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Then Open From</label>
                  <input
                    type="time"
                    value={data.then_open_from}
                    onChange={(e) => updateEditField('then_open_from', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Then Open To</label>
                  <input
                    type="time"
                    value={data.then_open_to}
                    onChange={(e) => updateEditField('then_open_to', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {locations.length === 0 && (
        <div className="empty-state">
          <MapPin size={48} />
          <p>No locations yet. Add your first location!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;