"use client";
import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../../../_utils/auth';
import { Camera, Edit2, Save, X, Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useLoading } from '@/app/_components/general/LoadingSpinner'; 


const ProfilePage = () => {
     const { data: session, status } = useSession();
     const isAuthenticated = status === "authenticated";
     const [error, setError] = useState('');
     const [isEditing, setIsEditing] = useState(false);
     const [isChangingPassword, setIsChangingPassword] = useState(false);
     const { startLoading, stopLoading } = useLoading();
     const [showPassword, setShowPassword] = useState({
          current: false,
          new: false,
          confirm: false
     });
     
     const [user, setUser] = useState(null);
     // Form states
     const [profileData, setProfileData] = useState({
          name: '',
          email: '',
          phone: '',
          address: '',
          profilePhoto: null
     });

     const [passwordData, setPasswordData] = useState({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
     });



     // Fetch user profile on component mount
     useEffect(() => {
          const loadUserProfile = async () => {
               if (!isAuthenticated) {
                    return;
               }

               startLoading('Loading profile...');
               setTimeout( async () => {
                    try {
                         // console.log("Session::", session);
                         
                         const token = session?.user?.accessToken;
                         // console.log("Token::", token);
     
                         if (!token) {
                              setError('No access token found. Please login again.');
                              stopLoading();
                              return;
                         }
     
                         // Fetch user details
                         const response = await fetchUserDetails(token);
                         // console.log("response:: ", response);
                         if (response?._id) {
                              setUser(response);
                              setProfileData({
                                   name: response.firstName + ' ' + response.lastName || '',
                                   email: response.email || '',
                                   phone: response.phone || '',
                                   address: response.address || '',
                                   profilePhoto: response.image || null
                              });
                         } else {
                              setError(response.message || 'Failed to fetch user details');
                         }
                    } catch (err) {
                         setError('Error loading profile: ' + err.message);
                    } finally {
                         stopLoading();
                    }

               }, 1000);
          };

          
          if (status !== 'loading') {
               loadUserProfile();
          }
     }, [session, status, isAuthenticated]);

     // Handle profile photo upload
     const handlePhotoUpload = (event) => {
          const file = event.target.files[0];
          if (file) {
               if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    setError('File size should be less than 5MB');
                    return;
               }

               const reader = new FileReader();
               reader.onload = (e) => {
                    setProfileData(prev => ({
                         ...prev,
                         profilePhoto: e.target.result
                    }));
               };
               reader.readAsDataURL(file);
          }
     };

     // Handle profile update  -- needs to fix this
     const handleProfileUpdate = async (e) => {
          e.preventDefault();
          startLoading('Updating profile...');
          setError('');

          try {
               const token = session?.user?.accessToken;
               if (!token) {
                    setError('No access token found. Please login again.');
                    stopLoading();
                    return;
               }

               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile/update`, {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                         'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
               });

               const data = await response.json();

               if (data.success) {
                    setUser(data.user);
                    setIsEditing(false);
                    setError('');
                    // Show success message
                    alert('Profile updated successfully!');
               } else {
                    setError(data.message || 'Failed to update profile');
               }
          } catch (err) {
               setError('Error updating profile: ' + err.message);
          } finally {
          stopLoading();
          }
     };

     // Handle password change  -- needs to fix this
     const handlePasswordChange = async (e) => {
          e.preventDefault();

          if (passwordData.newPassword !== passwordData.confirmPassword) {
               setError('New passwords do not match');
               return;
          }

          if (passwordData.newPassword.length < 6) {
               setError('New password must be at least 6 characters long');
               return;
          }

          startLoading('Changing password...');
          setError('');

          try {
               const token = session?.user?.accessToken;
               if (!token) {
                    setError('No access token found. Please login again.');
                    stopLoading();
                    return;
               }

               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/password/change`, {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                         'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                         currentPassword: passwordData.currentPassword,
                         newPassword: passwordData.newPassword
                    })
               });

               const data = await response.json();

               if (data.success) {
                    setIsChangingPassword(false);
                    setPasswordData({
                         currentPassword: '',
                         newPassword: '',
                         confirmPassword: ''
                    });
                    alert('Password changed successfully!');
               } else {
                    setError(data.message || 'Failed to change password');
               }
          } catch (err) {
               setError('Error changing password: ' + err.message);
          } finally {
               stopLoading();
          }
     };

     // Cancel editing
     const handleCancelEdit = () => {
          setIsEditing(false);
          setProfileData({
               name: user.firstName + ' ' + user.lastName + ' ' || '',
               email: user.email || '',
               phone: user.phone || '',
               address: user.address || '',
               profilePhoto: user.profilePhoto || null
          });
          setError('');
     };

     // Toggle password visibility
     const togglePasswordVisibility = (field) => {
          setShowPassword(prev => ({
               ...prev,
               [field]: !prev[field]
          }));
     };



     return (
          <div className="min-h-screen bg-gray-50 py-8">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-16">
                         <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                         <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                              <p className="text-red-600">{error}</p>
                         </div>
                    )}

                    {/* Profile Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                         <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                              {!isEditing && (
                                   <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                   >
                                        <Edit2 size={16} />
                                        Edit Profile
                                   </button>
                              )}
                         </div>

                         <form onSubmit={handleProfileUpdate}>
                              {/* Profile Photo */}
                              <div className="flex items-center gap-6 mb-6">
                                   <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                             {profileData.profilePhoto ? (
                                                  <img
                                                       src={profileData.profilePhoto}
                                                       alt="Profile"
                                                       className="w-full h-full object-cover"
                                                  />
                                             ) : (
                                                  <User size={32} className="text-gray-400" />
                                             )}
                                        </div>
                                        {isEditing && (
                                             <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                                  <Camera size={16} className="text-white" />
                                                  <input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={handlePhotoUpload}
                                                       className="hidden"
                                                  />
                                             </label>
                                        )}
                                   </div>
                                   <div>
                                        <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                                        <p className="text-gray-600">{user?.email}</p>
                                   </div>
                              </div>

                              {/* Form Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {/* Name */}
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                             <User size={16} className="inline mr-2" />
                                             Full Name
                                        </label>
                                        <input
                                             type="text"
                                             value={profileData.name}
                                             onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                             disabled={!isEditing}
                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                             required
                                        />
                                   </div>

                                   {/* Email */}
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                             <Mail size={16} className="inline mr-2" />
                                             Email Address
                                        </label>
                                        <input
                                             type="email"
                                             value={profileData.email}
                                             onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                             disabled={!isEditing}
                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                             required
                                        />
                                   </div>

                                   {/* Phone */}
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                             <Phone size={16} className="inline mr-2" />
                                             Phone Number
                                        </label>
                                        <input
                                             type="tel"
                                             value={profileData.phone}
                                             onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                             disabled={!isEditing}
                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                   </div>

                                   {/* Address */}
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                             <MapPin size={16} className="inline mr-2" />
                                             Address
                                        </label>
                                        <input
                                             type="text"
                                             value={profileData.address}
                                             onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                                             disabled={!isEditing}
                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                   </div>
                              </div>

                              {/* Action Buttons */}
                              {isEditing && (
                                   <div className="flex gap-4 mt-6">
                                        <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                             <Save size={16} />
                                        Save Changes
                                        </button>
                                        <button
                                             type="button"
                                             onClick={handleCancelEdit}
                                             className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                             <X size={16} />
                                             Cancel
                                        </button>
                                   </div>
                              )}
                         </form>
                    </div>

                    {/* Password Change Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                         <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                              {!isChangingPassword && (
                                   <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                   >
                                        <Lock size={16} />
                                        Change Password
                                   </button>
                              )}
                         </div>

                         {isChangingPassword && (
                              <form onSubmit={handlePasswordChange}>
                                   <div className="space-y-4">
                                        {/* Current Password */}
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Current Password
                                             </label>
                                             <div className="relative">
                                                  <input
                                                       type={showPassword.current ? "text" : "password"}
                                                       value={passwordData.currentPassword}
                                                       onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                       className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                       required
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() => togglePasswordVisibility('current')}
                                                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                  >
                                                       {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                  </button>
                                             </div>
                                        </div>

                                   </div>
                              </form>
                         )}
                    </div>
               </div>
          </div>
     )
}

export default ProfilePage;