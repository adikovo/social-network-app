import React from 'react';
import FormField from './FormField';
import SelectField from './SelectField';

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

                    <FormField
                        id="aboutMe"
                        label="About Me"
                        type="textarea"
                        value={bio.aboutMe}
                        onChange={(value) => handleBioInputChange('aboutMe', value)}
                        placeholder="Tell potential roommates about yourself, your interests, hobbies, etc."
                        isEditing={isEditing}
                        rows={4}
                    />
                </div>

                <div className="row mb-4">
                    {/*basic info */}
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <h6 className="mb-0 text-primary">Basic Information</h6>
                        </div>
                        <div className="row g-2">
                            <div className="col-12">
                                <FormField
                                    id="age"
                                    label="Age"
                                    type="number"
                                    value={bio.age}
                                    onChange={(value) => handleBioInputChange('age', value)}
                                    placeholder="Your age"
                                    isEditing={isEditing}
                                />
                            </div>
                            <div className="col-12">
                                <FormField
                                    id="occupation"
                                    label="Occupation"
                                    type="text"
                                    value={bio.occupation}
                                    onChange={(value) => handleBioInputChange('occupation', value)}
                                    placeholder="e.g., Student, Software Engineer"
                                    isEditing={isEditing}
                                />
                            </div>
                            <div className="col-12">
                                <FormField
                                    id="budget"
                                    label="Budget (per month)"
                                    type="text"
                                    value={bio.budget}
                                    onChange={(value) => handleBioInputChange('budget', value)}
                                    placeholder="e.g., $800-1200"
                                    isEditing={isEditing}
                                />
                            </div>
                            <div className="col-12">
                                <FormField
                                    id="location"
                                    label="Preferred Location"
                                    type="text"
                                    value={bio.location}
                                    onChange={(value) => handleBioInputChange('location', value)}
                                    placeholder="e.g., Downtown, Near University"
                                    isEditing={isEditing}
                                />
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
                                <SelectField
                                    id="smoking"
                                    label="Smoking"
                                    value={bio.lifestyle?.smoking}
                                    onChange={(value) => handleBioInputChange('lifestyle.smoking', value)}
                                    isEditing={isEditing}
                                    options={[
                                        { value: 'yes', label: 'Yes' },
                                        { value: 'no', label: 'No' },
                                        { value: 'occasionally', label: 'Occasionally' }
                                    ]}
                                />
                            </div>
                            <div className="col-12">
                                <SelectField
                                    id="pets"
                                    label="Pets"
                                    value={bio.lifestyle?.pets}
                                    onChange={(value) => handleBioInputChange('lifestyle.pets', value)}
                                    isEditing={isEditing}
                                    options={[
                                        { value: 'yes', label: 'Yes, I have pets' },
                                        { value: 'no', label: 'No pets' },
                                        { value: 'allergic', label: 'Allergic to pets' }
                                    ]}
                                />
                            </div>
                            <div className="col-12">
                                <SelectField
                                    id="partying"
                                    label="Partying"
                                    value={bio.lifestyle?.partying}
                                    onChange={(value) => handleBioInputChange('lifestyle.partying', value)}
                                    isEditing={isEditing}
                                    options={[
                                        { value: 'frequent', label: 'Frequent' },
                                        { value: 'occasional', label: 'Occasional' },
                                        { value: 'rarely', label: 'Rarely' },
                                        { value: 'never', label: 'Never' }
                                    ]}
                                />
                            </div>
                            <div className="col-12">
                                <FormField
                                    id="cleanliness"
                                    label="Cleanliness"
                                    type="select"
                                    value={bio.lifestyle?.cleanliness}
                                    onChange={(value) => handleBioInputChange('lifestyle.cleanliness', value)}
                                    isEditing={isEditing}
                                    options={[
                                        { value: 'very clean', label: 'Very Clean' },
                                        { value: 'clean', label: 'Clean' },
                                        { value: 'average', label: 'Average' },
                                        { value: 'messy', label: 'Messy' }
                                    ]}
                                />
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
                            <SelectField
                                id="preferredGender"
                                label="Preferred Gender"
                                value={bio.preferences?.gender}
                                onChange={(value) => handleBioInputChange('preferences.gender', value)}
                                isEditing={isEditing}
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' }
                                ]}
                                style={{ borderRadius: '10px' }}
                                showAnyOption={true}
                                anyOptionText="Any"
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectField
                                id="preferredAgeRange"
                                label="Preferred Age Range"
                                value={bio.preferences?.ageRange}
                                onChange={(value) => handleBioInputChange('preferences.ageRange', value)}
                                isEditing={isEditing}
                                options={[
                                    { value: '18-25', label: '18-25' },
                                    { value: '26-35', label: '26-35' },
                                    { value: '36+', label: '36+' }
                                ]}
                                style={{ borderRadius: '10px' }}
                                showAnyOption={true}
                                anyOptionText="Any"
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectField
                                id="smokingPreference"
                                label="Smoking Preference"
                                value={bio.preferences?.smokingPreference}
                                onChange={(value) => handleBioInputChange('preferences.smokingPreference', value)}
                                isEditing={isEditing}
                                options={[
                                    { value: 'smoker', label: 'Smoker OK' },
                                    { value: 'non-smoker', label: 'Non-smoker only' }
                                ]}
                                style={{ borderRadius: '10px' }}
                                showAnyOption={true}
                                anyOptionText="Any"
                            />
                        </div>
                        <div className="col-md-6">
                            <SelectField
                                id="petPreference"
                                label="Pet Preference"
                                value={bio.preferences?.petPreference}
                                onChange={(value) => handleBioInputChange('preferences.petPreference', value)}
                                isEditing={isEditing}
                                options={[
                                    { value: 'pet-friendly', label: 'Pet-friendly' },
                                    { value: 'no pets', label: 'No pets' }
                                ]}
                                style={{ borderRadius: '10px' }}
                                showAnyOption={true}
                                anyOptionText="Any"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BioForm;
