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
  const [message, setMessage] = useState('');
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [imageRetry, setImageRetry] = useState(0);

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
      setImageVersion(Date.now());
      setImageRetry(0);
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

  const apiBaseUrl =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

  const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  const imageSrc = (() => {
    if (preview) {
      return preview;
    }

    if (!user.profileImage) {
      return '';
    }

    if (user.profileImage.startsWith('http')) {
      return user.profileImage;
    }

    return `${serverBaseUrl}${user.profileImage}?v=${imageVersion}&retry=${imageRetry}`;
  })();

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        My Profile
      </h1>

      <div className="flex flex-col items-center mb-6">
        {imageSrc ? (
          <img
            key={imageSrc}
            src={imageSrc}
            alt="Profile"
            onError={() => {
              if (imageRetry < 3) {
                setTimeout(() => {
                  setImageRetry((prev) => prev + 1);
                }, 1000);
              }
            }}
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