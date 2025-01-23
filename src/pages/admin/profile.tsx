import { VerticalForm, VerticalFormButton, VerticalFormTitle, Cropper } from '@/components/common';
import { showToast, config } from '@/lib';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import { KlefkiAPI } from '@/lib/api';

import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ChangeEvent, useEffect, useState, useRef } from 'react';

interface UploadBoardPhotoProps {
  user: PrivateProfile;
}
interface FormValues {
  photo: File;
}
const UpdateProfilePage: NextPage<UploadBoardPhotoProps> = ({
  user: { firstName, lastName },
}: UploadBoardPhotoProps) => {
  const { handleSubmit } = useForm<FormValues>();
  const [file, setFile] = useState<Blob | null>(null);
  const [croppedImg, setCroppedImg] = useState<Blob | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden file input
  const [previewURL, setPreviewURL] = useState<string>('');

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    const maxFileSize = 5 * 1024 * 1024;

    if (uploadedFile) {
      if (!uploadedFile.type.startsWith('image/')) {
        showToast('Unsupported file type. Please upload an image.');
        return;
      }
      if (uploadedFile.size > maxFileSize) {
        showToast('File size exceeds the 5MB limit. Please upload a smaller image.');
        return;
      }
      setUploadedURL(null);
      setFile(uploadedFile);
      setIsCropperOpen(true);
    }
  };

  const handleCrop = async (croppedFile: Blob) => {
    setCroppedImg(croppedFile);
    setIsCropperOpen(false);
    setPreviewURL(URL.createObjectURL(croppedFile));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate a click on the hidden file input
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async () => {
    if (!croppedImg) {
      showToast('Please crop your image to submit!');
      return;
    }
    try {
      const croppedFile = new File([croppedImg], `${firstName}_${lastName}`, {
        type: 'image/*',
      });

      const response = await KlefkiAPI.uploadBoardPhoto(croppedFile);
      showToast('Photo uploaded successfully!');
      if (response.url) {
        setUploadedURL(response.url);
      }
    } catch (error) {
      reportError('Error found!', error);
      setUploadedURL(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL); // Clean up the blob URL
      }
    };
  }, [previewURL]);

  return (
    <VerticalForm onEnterPress={handleSubmit(onSubmit)}>
      <VerticalFormTitle
        text="Upload Board Photo"
        description="Upload your Board Photo on the ACM Website"
      />
      {uploadedURL && (
        <div>
          <h1>Your Image URL is: </h1>
          <a href={uploadedURL}>{uploadedURL}</a>
        </div>
      )}
      {!uploadedURL && croppedImg && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* <GifSafeImage src={previewURL} alt="Preview of image" width={200} height={200} /> */}
          <img
            src={previewURL}
            alt="Cropped Preview"
            style={{
              width: '200px', // Set fixed width
              height: '200px', // Set fixed height
              borderRadius: '10px',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
          />
        </div>
      )}

      <VerticalFormButton
        type="button"
        display="button2"
        text="Upload New Photo"
        onClick={triggerFileInput}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      {!uploadedURL && isCropperOpen && file && (
        <Cropper
          file={file}
          aspectRatio={1}
          circle={false}
          maxFileHeight={5000}
          maxSize={5 * 1024 * 1024}
          onCrop={handleCrop}
          onClose={() => setIsCropperOpen(false)}
        />
      )}
      {!uploadedURL && croppedImg && (
        <VerticalFormButton
          type="button"
          display="button1"
          text="Submit Photo"
          onClick={handleSubmit(onSubmit)}
        />
      )}
    </VerticalForm>
  );
};
export default UpdateProfilePage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async () => {
  return {
    props: {
      title: 'Upload Board Photo',
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewAdminPage,
  { redirectTo: config.admin.homeRoute }
);
