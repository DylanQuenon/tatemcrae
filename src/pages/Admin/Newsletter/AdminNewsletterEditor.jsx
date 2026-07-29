import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import newsletterAPI from '../../../services/newsletterAPI';


// Custom font family for TinyMCE editor
const YOUR_FONT_FAMILY = "Unison Pro, sans-serif";

export default function AdminNewsletterEditor() {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const tinymceApiKey = import.meta.env?.VITE_TINYMCE_API_KEY || (typeof process !== 'undefined' ? process.env.REACT_APP_TINYMCE_API_KEY : '');

    const handleSendNewsletter = async (e) => {
        e.preventDefault();
        setStatus('Sending in progress...');
        setLoading(true);

        try {
            const data = await newsletterAPI.publishNewsletter({ subject, content });
            setStatus(data.message || 'Newsletter sent successfully.');
            setSubject('');
            setContent('');
        } catch (error) {
            console.error('API Error:', error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Error while sending the newsletter.';
            setStatus(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                w-full
                min-h-screen
                bg-secondary
                text-primary
                py-24
                font-['Unison_Pro',sans-serif]
                relative
                bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]
                bg-[size:24px_24px]
            "
        >
            <section className="max-w-4xl mx-auto border border-primary/20 bg-secondary/80 backdrop-blur-xs p-6 md:p-10">
                
                {/* Header */}
                <div className="flex flex-col gap-3 pb-8 mb-8 border-b border-primary/20">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60">
                        ADMIN PANEL — OFFICIAL COMMUNICATIONS
                    </span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight text-primary">
                        NEWSLETTER PUBLISHER
                    </h1>
                    <p className="text-xs md:text-sm text-primary/70 uppercase">
                        COMPOSE AND BROADCAST OFFICIAL ANNOUNCEMENTS TO SUBSCRIBERS.
                    </p>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSendNewsletter} className="space-y-8">
                    
                    {/* Subject Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-primary tracking-wide">
                            SUBJECT LINE
                        </label>
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            required 
                            disabled={loading}
                            placeholder="EX: TATE MCRAE — WORLD TOUR ANNOUNCEMENT"
                            className="
                                w-full
                                px-4
                                py-3
                                bg-primary/5
                                border
                                border-primary/20
                                rounded-xl
                                text-xs
                                md:text-sm
                                uppercase
                                text-primary
                                placeholder:text-primary/40
                                placeholder:normal-case
                                focus:outline-none
                                focus:border-primary
                                transition-colors
                                disabled:opacity-50
                            "
                        />
                    </div>

                    {/* Rich Text Content */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase text-primary tracking-wide">
                            NEWSLETTER BODY
                        </label>
                        <div className="border border-primary/20 rounded-xl overflow-hidden bg-primary/5 focus-within:border-primary transition-colors">
                            <Editor
                                apiKey={tinymceApiKey}
                                value={content}
                                disabled={loading}
                                onEditorChange={(newContent) => setContent(newContent)}
                                init={{
                                    height: 480,
                                    menubar: false,
                                    skin: "oxide-dark",
                                    content_css: "dark",
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image',
                                        'charmap', 'preview', 'anchor', 'searchreplace',
                                        'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks fontsizeinput | ' +
                                        'bold italic backcolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'image link media | removeformat | help',
                                    
                                    image_title: true,
                                    automatic_uploads: true,
                                    file_picker_types: 'image',
                                    images_upload_handler: (blobInfo) => new Promise((resolve) => {
                                        resolve("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
                                    }),

                                    content_style: `
                                        body {
                                            font-family: ${YOUR_FONT_FAMILY};
                                            font-size: 14px;
                                            line-height: 1.6;
                                            background-color: #051e42;
                                            color: #ffffff;
                                            padding: 16px;
                                            text-transform: uppercase;
                                        }
                                        h1 {
                                            font-size: 2rem;
                                            font-weight: 900;
                                            margin-top: 1.2em;
                                            margin-bottom: 0.5em;
                                            color: #ffffff;
                                            text-transform: uppercase;
                                        }
                                        h2 {
                                            font-size: 1.5rem;
                                            font-weight: 700;
                                            margin-top: 1.2em;
                                            margin-bottom: 0.5em;
                                            color: #f1f5f9;
                                            text-transform: uppercase;
                                        }
                                        h3 {
                                            font-size: 1.2rem;
                                            font-weight: 700;
                                            margin-top: 1em;
                                            margin-bottom: 0.4em;
                                            color: #cbd5e1;
                                            text-transform: uppercase;
                                        }
                                        p {
                                            margin-bottom: 1em;
                                        }
                                        img {
                                            max-width: 100%;
                                            height: auto;
                                            border-radius: 12px;
                                            margin: 12px 0;
                                        }
                                    `
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`
                            w-full
                            py-4
                            px-6
                            text-xs
                            md:text-sm
                            font-bold
                            uppercase
                            tracking-wider
                            border
                            border-primary/40
                            rounded-xl
                            transition-all
                            duration-300
                            ${
                                loading 
                                    ? 'bg-primary/20 text-primary/40 border-primary/20 cursor-not-allowed' 
                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-secondary border-primary/40 cursor-pointer'
                            }
                        `}
                    >
                        {loading ? 'SENDING IN PROGRESS...' : 'SEND NEWSLETTER TO ALL SUBSCRIBERS'}
                    </button>

                    {/* Status Feedback */}
                    {status && (
                        <div className={`
                            p-4
                            rounded-xl
                            text-center
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            border
                            ${
                                status.toLowerCase().includes('success') || status.toLowerCase().includes('succès')
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }
                        `}>
                            {status}
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
}