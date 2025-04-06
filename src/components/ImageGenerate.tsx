import React, { useState, useRef, useEffect } from 'react';

const ImageGenerate: React.FC = () => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [bgLoaded, setBgLoaded] = useState(false);
    const [bgImageSize, setBgImageSize] = useState({ width: 0, height: 0 });
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

    // Fixed background image
    const backgroundImage = '/invitation-bg.png';

    // Draw background image
    const drawBackground = (canvas: HTMLCanvasElement, scale: number = 1) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = new Image();
        bgImg.onload = () => {
            canvas.width = bgImg.width * scale;
            canvas.height = bgImg.height * scale;
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        };
        bgImg.src = backgroundImage;
    };

    // Draw avatar if exists
    const drawAvatar = (canvas: HTMLCanvasElement) => {
        if (!avatar) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const avatarImg = new Image();
        avatarImg.onload = () => {
            // Calculate the circle size and position based on the canvas size
            const circleX = canvas.width * 0.144; // Adjusted X position to match left pink circle
            const circleY = canvas.height * 0.33; // Adjusted Y position to match circle height
            const circleDiameter = canvas.height * 0.32; // Adjusted size to match circle size

            // Calculate the square crop size from the avatar (use the smaller dimension)
            const cropSize = Math.min(avatarImg.width, avatarImg.height);

            // Calculate crop position to center the image
            const cropX = (avatarImg.width - cropSize) / 2;
            const cropY = (avatarImg.height - cropSize) / 2;

            // Create circular clipping path
            ctx.save();
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleDiameter / 2, 0, Math.PI * 2);
            ctx.clip();

            // Draw the cropped and scaled avatar
            ctx.drawImage(
                avatarImg,
                cropX, cropY, // Source position (crop from center)
                cropSize, cropSize, // Source size (square crop)
                circleX - circleDiameter / 2, circleY - circleDiameter / 2, // Destination position
                circleDiameter, circleDiameter // Destination size
            );
            ctx.restore();
        };
        avatarImg.src = avatar;
    };

    // Draw name if exists
    const drawName = (canvas: HTMLCanvasElement) => {
        if (!name) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use larger font size and match the pink color
        const fontSize = canvas.height * 0.12; // Same size as "Dear"
        ctx.fillStyle = '#FFC0CB'; // Pink color to match "Dear"

        // Draw the name in italic
        ctx.font = `italic ${fontSize}px serif`;
        ctx.textAlign = 'left';
        ctx.fillText(name, canvas.width * 0.23, canvas.height * 0.12);
    };

    // Initial background load
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setBgLoaded(true);
            setBgImageSize({ width: img.width, height: img.height });
            if (previewCanvasRef.current) {
                const maxPreviewHeight = 600; // Increased preview size
                const scale = maxPreviewHeight / img.height;
                drawBackground(previewCanvasRef.current, scale);
            }
        };
        img.onerror = () => console.error('Failed to load background image');
        img.src = backgroundImage;
    }, []);

    // Update avatar when uploaded
    useEffect(() => {
        if (bgLoaded && previewCanvasRef.current && avatar) {
            const maxPreviewHeight = 600;
            const scale = maxPreviewHeight / bgImageSize.height;
            drawBackground(previewCanvasRef.current, scale);
            setTimeout(() => {
                if (previewCanvasRef.current) {
                    drawAvatar(previewCanvasRef.current);
                    if (name) drawName(previewCanvasRef.current);
                }
            }, 100);
        }
    }, [avatar, bgLoaded]);

    // Update name when changed
    useEffect(() => {
        if (bgLoaded && previewCanvasRef.current) {
            const maxPreviewHeight = 600;
            const scale = maxPreviewHeight / bgImageSize.height;
            drawBackground(previewCanvasRef.current, scale);
            setTimeout(() => {
                if (previewCanvasRef.current) {
                    if (avatar) drawAvatar(previewCanvasRef.current);
                    drawName(previewCanvasRef.current);
                }
            }, 100);
        }
    }, [name, bgLoaded]);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateAndDownload = () => {
        if (!hiddenCanvasRef.current || !avatar || !name) return;

        // Draw at original size
        drawBackground(hiddenCanvasRef.current, 1);

        // Wait for background to load then add avatar and name
        setTimeout(() => {
            if (!hiddenCanvasRef.current) return;
            drawAvatar(hiddenCanvasRef.current);
            drawName(hiddenCanvasRef.current);

            // Wait for all elements to be drawn then download
            setTimeout(() => {
                if (!hiddenCanvasRef.current) return;
                const link = document.createElement('a');
                link.download = `invitation-${name}.png`;
                link.href = hiddenCanvasRef.current.toDataURL('image/png');
                link.click();
            }, 300);
        }, 100);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
                <label className="block text-gray-700 text-lg font-bold mb-3">
                    Select Your Avatar
                </label>
                <div className="space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="w-full p-4 text-lg border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-lg file:font-medium file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                    />
                </div>
            </div>

            <div className="w-full max-w-xl">
                <label className="block text-gray-700 text-2xl font-bold mb-4">
                    Enter Name
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter the name to display on the invitation"
                    className="w-full p-6 text-xl border border-gray-300 rounded-xl"
                />
            </div>

            <button
                onClick={generateAndDownload}
                className="w-full max-w-xl px-10 py-6 bg-pink-500 text-white rounded-xl text-xl font-bold hover:bg-pink-600 transition-colors"
                disabled={!avatar || !name || !bgLoaded}
            >
                Generate & Download
            </button>

            <div className="mt-8 w-full max-w-4xl bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                <p className="text-center text-gray-500 text-sm py-2 bg-gray-100">Preview</p>
                <canvas
                    ref={previewCanvasRef}
                    className="w-full h-auto"
                />
            </div>

            {/* Hidden canvas for high-resolution output */}
            <canvas
                ref={hiddenCanvasRef}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageGenerate; 