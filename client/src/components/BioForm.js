import React from 'react';

function BioForm({ bio, onBioChange, isEditing = true, showTitle = true }) {

    function handleBioInputChange(field, value) {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            onBioChange({
                ...bio,
                [parent]: {
                    ...bio[parent],
                    [child]: value
                }
            });
        } else {
            onBioChange({
                ...bio,
                [field]: value
            });
        }
    }

    return (
        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            {showTitle && (
                <div className="card-header bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0">Roommate Profile Information</h5>
                    </div>
                    {isEditing && <small className="opacity-75">Help potential roommates get to know you!</small>}
                </div>
            )}
            <div className="card-body p-4">

                {/* about me */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <h6 className="mb-0 text-primary">Personal Details</h6>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="aboutMe" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block' }}>
                            About Me
                        </label>
                        {isEditing ? (
                            <textarea
                                className="form-control"
                                id="aboutMe"
                                rows="4"
                                value={bio.aboutMe || ''}
                                onChange={(e) => handleBioInputChange('aboutMe', e.target.value)}
                                placeholder="Tell potential roommates about yourself, your interests, hobbies, etc."
                                style={{ borderRadius: '10px', minHeight: '100px', textAlign: 'left' }}
                            />
                        ) : (
                            <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px', minHeight: '100px', textAlign: 'left' }}>
                                {bio.aboutMe ? (
                                    <span style={{ color: '#212529', fontWeight: '500' }}>{bio.aboutMe}</span>
                                ) : (
                                    <span className="text-muted">Not specified</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="row mb-4">
                    {/*basic info */}
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <h6 className="mb-0 text-primary">Basic Information</h6>
                        </div>
                        <div className="row g-2">
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="age" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Age
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="age"
                                            value={bio.age || ''}
                                            onChange={(e) => handleBioInputChange('age', e.target.value)}
                                            placeholder="Your age"
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.age || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="occupation" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Occupation
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="occupation"
                                            value={bio.occupation || ''}
                                            onChange={(e) => handleBioInputChange('occupation', e.target.value)}
                                            placeholder="e.g., Student, Software Engineer"
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.occupation || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="budget" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Budget (per month)
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="budget"
                                            value={bio.budget || ''}
                                            onChange={(e) => handleBioInputChange('budget', e.target.value)}
                                            placeholder="e.g., $800-1200"
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.budget || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="location" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Preferred Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            value={bio.location || ''}
                                            onChange={(e) => handleBioInputChange('location', e.target.value)}
                                            placeholder="e.g., Downtown, Near University"
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        />
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.location || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*lifestyle*/}
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <h6 className="mb-0 text-primary">Lifestyle</h6>
                        </div>
                        <div className="row g-2">
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="smoking" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Smoking
                                    </label>
                                    {isEditing ? (
                                        <select
                                            className="form-select"
                                            id="smoking"
                                            value={bio.lifestyle?.smoking || ''}
                                            onChange={(e) => handleBioInputChange('lifestyle.smoking', e.target.value)}
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="occasionally">Occasionally</option>
                                        </select>
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.lifestyle?.smoking || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="pets" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Pets
                                    </label>
                                    {isEditing ? (
                                        <select
                                            className="form-select"
                                            id="pets"
                                            value={bio.lifestyle?.pets || ''}
                                            onChange={(e) => handleBioInputChange('lifestyle.pets', e.target.value)}
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="yes">Yes, I have pets</option>
                                            <option value="no">No pets</option>
                                            <option value="allergic">Allergic to pets</option>
                                        </select>
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.lifestyle?.pets || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="partying" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Partying
                                    </label>
                                    {isEditing ? (
                                        <select
                                            className="form-select"
                                            id="partying"
                                            value={bio.lifestyle?.partying || ''}
                                            onChange={(e) => handleBioInputChange('lifestyle.partying', e.target.value)}
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="frequent">Frequent</option>
                                            <option value="occasional">Occasional</option>
                                            <option value="rarely">Rarely</option>
                                            <option value="never">Never</option>
                                        </select>
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.lifestyle?.partying || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label htmlFor="cleanliness" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block', fontSize: '0.9rem' }}>
                                        Cleanliness
                                    </label>
                                    {isEditing ? (
                                        <select
                                            className="form-select"
                                            id="cleanliness"
                                            value={bio.lifestyle?.cleanliness || ''}
                                            onChange={(e) => handleBioInputChange('lifestyle.cleanliness', e.target.value)}
                                            style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem' }}
                                        >
                                            <option value="">Select...</option>
                                            <option value="very clean">Very Clean</option>
                                            <option value="clean">Clean</option>
                                            <option value="average">Average</option>
                                            <option value="messy">Messy</option>
                                        </select>
                                    ) : (
                                        <div className="form-control-plaintext p-2 bg-light rounded" style={{ borderRadius: '8px', textAlign: 'left', fontSize: '0.9rem' }}>
                                            <span style={{ color: '#212529', fontWeight: '500' }}>{bio.lifestyle?.cleanliness || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*preferences */}
                <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <h6 className="mb-0 text-primary">Roommate Preferences</h6>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="preferredGender" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block' }}>
                                    Preferred Gender
                                </label>
                                {isEditing ? (
                                    <select
                                        className="form-select"
                                        id="preferredGender"
                                        value={bio.preferences?.gender || ''}
                                        onChange={(e) => handleBioInputChange('preferences.gender', e.target.value)}
                                        style={{ borderRadius: '10px', textAlign: 'left' }}
                                    >
                                        <option value="">Any</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                ) : (
                                    <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px', textAlign: 'left' }}>
                                        <span style={{ color: '#212529', fontWeight: '500' }}>{bio.preferences?.gender || 'Any'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="preferredAgeRange" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block' }}>
                                    Preferred Age Range
                                </label>
                                {isEditing ? (
                                    <select
                                        className="form-select"
                                        id="preferredAgeRange"
                                        value={bio.preferences?.ageRange || ''}
                                        onChange={(e) => handleBioInputChange('preferences.ageRange', e.target.value)}
                                        style={{ borderRadius: '10px', textAlign: 'left' }}
                                    >
                                        <option value="">Any</option>
                                        <option value="18-25">18-25</option>
                                        <option value="26-35">26-35</option>
                                        <option value="36+">36+</option>
                                    </select>
                                ) : (
                                    <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px', textAlign: 'left' }}>
                                        <span style={{ color: '#212529', fontWeight: '500' }}>{bio.preferences?.ageRange || 'Any'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="smokingPreference" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block' }}>
                                    Smoking Preference
                                </label>
                                {isEditing ? (
                                    <select
                                        className="form-select"
                                        id="smokingPreference"
                                        value={bio.preferences?.smokingPreference || ''}
                                        onChange={(e) => handleBioInputChange('preferences.smokingPreference', e.target.value)}
                                        style={{ borderRadius: '10px', textAlign: 'left' }}
                                    >
                                        <option value="">Any</option>
                                        <option value="smoker">Smoker OK</option>
                                        <option value="non-smoker">Non-smoker only</option>
                                    </select>
                                ) : (
                                    <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px', textAlign: 'left' }}>
                                        <span style={{ color: '#212529', fontWeight: '500' }}>{bio.preferences?.smokingPreference || 'Any'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="petPreference" className="form-label" style={{ color: '#212529', fontWeight: '600', textAlign: 'left', display: 'block' }}>
                                    Pet Preference
                                </label>
                                {isEditing ? (
                                    <select
                                        className="form-select"
                                        id="petPreference"
                                        value={bio.preferences?.petPreference || ''}
                                        onChange={(e) => handleBioInputChange('preferences.petPreference', e.target.value)}
                                        style={{ borderRadius: '10px', textAlign: 'left' }}
                                    >
                                        <option value="">Any</option>
                                        <option value="pet-friendly">Pet-friendly</option>
                                        <option value="no pets">No pets</option>
                                    </select>
                                ) : (
                                    <div className="form-control-plaintext p-3 bg-light rounded" style={{ borderRadius: '10px', textAlign: 'left' }}>
                                        <span style={{ color: '#212529', fontWeight: '500' }}>{bio.preferences?.petPreference || 'Any'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BioForm;
