import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QrCodeIcon from '@/assets/images/dashboard/settings/qr-code.svg';
import Image from "next/image";


const QrCodes = () => {
  return (
    <div className="space-y-6">
      {/* School Logo */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">School Logo</h2>
        <p className="text-sm text-gray-500 mb-4">Logo</p>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <Image 
                src={QrCodeIcon}
                alt="qr-code"
                width={50}
                height={50}
                className="mx-auto"
            />
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop image here, or
            <br />
            click add image
          </p>
        </div>
        <Button variant="secondary" className="w-full mt-4">
          Add Logo
        </Button>
      </div>

      {/* Registration QR Code */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Registration QR Code
        </h2>
        <p className="text-sm text-gray-500 mb-4">QR Code</p>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <Image 
                src={QrCodeIcon}
                alt="qr-code"
                width={50}
                height={50}
                className="mx-auto"
            />
          <p className="mt-2 text-sm text-gray-500">
            Generate or Drag and Drop
            <br />
            QR Code Here
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" className="flex-1">
            Generate
          </Button>
          <Button variant="secondary" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Entry/Exit QR Code */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Entry/Exit QR Code
        </h2>
        <p className="text-sm text-gray-500 mb-4">QR Code</p>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <Image 
                src={QrCodeIcon}
                alt="qr-code"
                width={50}
                height={50}
                className="mx-auto"
            />
          <p className="mt-2 text-sm text-gray-500">
            Generate or Drag and Drop
            <br />
            QR Code Here
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="secondary" className="flex-1">
            Generate
          </Button>
          <Button variant="secondary" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QrCodes;
