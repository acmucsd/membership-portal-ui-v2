import {
  VerticalForm,
  VerticalFormButton,
  VerticalFormItem,
  VerticalFormTitle,
  Cropper,
  GifSafeImage,
} from '@/components/common';
import { showToast, config } from '@/lib';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { reportError } from '@/lib/utils';
import { AdminAPI, EventAPI, KlefkiAPI } from '@/lib/api';

import type { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineMail, AiOutlineCalendar } from 'react-icons/ai';
import { VscLock } from 'react-icons/vsc';
import { report } from 'process';
import { useEffect, useState, useRef } from 'react';

interface UploadBoardPhotoProps {
  authToken: string;
}
interface FormValues {
  photo: File;
}
const updateProfilePage: NextPage<UploadBoardPhotoProps> = ({ authToken }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [file, setFile] = useState<Blob | null>(null);
  const [croppedImg, setCroppedImg] = useState<Blob | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the hidden file input
  const [previewURL, setPreviewURL] = useState<string>('');
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    const max_file_size = 5 * 1024 * 1024;
    
    if (uploadedFile) {
        if (!uploadedFile.type.startsWith("image/")) {
            showToast("Unsupported file type. Please upload an image.");
            return;
        }
        if (uploadedFile.size > max_file_size) {
            showToast("File size exceeds the 5MB limit. Please upload a smaller image.");
            return;
        }
        setFile(uploadedFile);
        setIsCropperOpen(true);
    }
  };

  const handleCrop = async (croppedFile: Blob) => {
    
    setCroppedImg(croppedFile);
    setIsCropperOpen(false);
    setPreviewURL(URL.createObjectURL(croppedFile));
    console.log(previewURL);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate a click on the hidden file input
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async ({ }) => {
    if (!croppedImg) {
      showToast('Please crop your image to submit!');
      return;
    }
    try {
      const croppedFile = new File([croppedImg], "croppedImage", {
        type: "image/*"
      })
      
      const response = await KlefkiAPI.uploadBoardPhoto(croppedFile);
      showToast('Photo uploaded successfully!');
      setUploadedURL(response.message);
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
      {croppedImg && (
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
      ></VerticalFormButton>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
      {isCropperOpen && file && (
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
      {croppedImg && (
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
export default updateProfilePage;
const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ authToken }) => ({
  props: {
    title: 'Add board photo',
    description: 'Upload board photo to the S3 for the current admin',
    authToken,
  },
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewAdminPage,
  { redirectTo: config.admin.homeRoute }
);
