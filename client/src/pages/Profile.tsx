import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  university: string;
  major: string;
  profileImage?: string;
};

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [profileImageBlobUrl, setProfileImageBlobUrl] = useState('');
  const [imageReloadKey, setImageReloadKey] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (error) {
        setMessage('Failed to load profile');
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!user?.profileImage) {
      setProfileImageBlobUrl('');
      return;
    }

    if (user.profileImage.startsWith('http')) {
      setProfileImageBlobUrl('');
      return;
    }

    let objectUrl = '';
    let isActive = true;

    const loadProfileImage = async () => {
      try {
        const profileImagePath = user.profileImage!.replace(/^\/api/, '');

        const response = await api.get<Blob>(profileImagePath, {
          responseType: 'blob'
        });

        objectUrl = URL.createObjectURL(response.data);

        if (isActive) {
          setProfileImageBlobUrl(objectUrl);
        }
      } catch (error) {
        if (isActive) {
          setProfileImageBlobUrl('');
        }
      }
    };

    loadProfileImage();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.profileImage, imageReloadKey]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Please choose an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put('/auth/profile-image', formData);

      setUser(response.data.data);
      setFile(null);
      setPreview('');
      setImageReloadKey((prev) => prev + 1);
      setMessage('Profile image updated successfully!');
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
        'Failed to update profile image'
      );
    }
  };

  if (!user) {
    if (message) {
      return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center text-red-600">
          {message}
        </div>
      );
    }

    return <LoadingSpinner text="Loading profile..." />;
  }

  const imageSrc = preview
    ? preview
    : user.profileImage?.startsWith('http')
      ? user.profileImage
      : profileImageBlobUrl;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        My Profile
      </h1>

      <div className="flex flex-col items-center mb-6">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border mb-4"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-4">
            No Image
          </div>
        )}

        <p className="font-semibold text-slate-800">{user.name}</p>
        <p className="text-slate-600">{user.email}</p>
        <p className="text-slate-600">
          {user.university} · {user.major}
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-slate-700 font-medium mb-2">
            Change Profile Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
        >
          Upload Image
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-slate-700">
          {message}
        </p>
      )}
    </div>
  );
}

export default Profile;