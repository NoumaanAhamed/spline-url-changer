'use client'

import React, { useState, FormEvent } from 'react';
import { AlertCircle, CheckCircle, Loader, Lock } from 'lucide-react';

interface FormState {
  splineUrl: string;
  password: string;
}

type MessageType = 'success' | 'error' | 'info' | null;

export default function Home() {
  const [formState, setFormState] = useState<FormState>({ splineUrl: '', password: '' });
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Processing...');
    setMessageType('info');

    try {
      const response = await fetch('/api/update-spline-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          splineUrl: formState.splineUrl,
          password: formState.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Spline URL updated successfully!');
        setMessageType('success');
        setFormState(prev => ({ ...prev, password: '' })); // Clear password after successful update
      } else {
        setMessage(data.message || 'Failed to update Spline URL');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const MessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Update Spline URL
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="splineUrl" className="block text-sm font-medium text-gray-700">
                Spline URL
              </label>
              <div className="mt-1">
                <input
                  id="splineUrl"
                  name="splineUrl"
                  type="url"
                  required
                  value={formState.splineUrl}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="https://prod.spline.design/your-scene-id/scene.splinecode"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formState.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  'Update URL'
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-4 flex items-center justify-center text-sm ${messageType === 'error' ? 'text-red-600' :
              messageType === 'success' ? 'text-green-600' :
                'text-gray-600'
              }`}>
              <MessageIcon />
              <span className="ml-2">{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}