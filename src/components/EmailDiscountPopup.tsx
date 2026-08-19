import { useEffect, useRef, useState, type FormEvent } from "react";
import { getImage } from "../utils/media";

const STORAGE_KEY = "s1ck-email-popup-v2";

const EmailDiscountPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showTeaser, setShowTeaser] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let hasSeenPopup = false;
        try {
            hasSeenPopup = window.localStorage.getItem(STORAGE_KEY) === "closed";
        } catch {
            // Storage may be unavailable in privacy-restricted browsers.
        }

        if (hasSeenPopup) {
            setShowTeaser(true);
            return;
        }

        const timer = window.setTimeout(() => setIsOpen(true), 1800);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusTimer = window.setTimeout(() => emailRef.current?.focus(), 250);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closePopup();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const rememberClosed = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "closed");
        } catch {
            // The popup can still close when storage is unavailable.
        }
    };

    const closePopup = () => {
        rememberClosed();
        setIsOpen(false);
        setShowTeaser(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        rememberClosed();

        const isShopifyStorefront = Boolean(
            (window as Window & { Shopify?: unknown }).Shopify,
        );

        if (!isShopifyStorefront) {
            event.preventDefault();
            setSubmitted(true);
            window.setTimeout(() => {
                setIsOpen(false);
                setShowTeaser(true);
            }, 1400);
        }
    };

    if (!isOpen) {
        if (!showTeaser) return null;

        return (
            <button
                type="button"
                className="discount-popup-teaser"
                onClick={() => {
                    setSubmitted(false);
                    setShowTeaser(false);
                    setIsOpen(true);
                }}
            >
                GET 10% OFF
            </button>
        );
    }

    return (
        <div
            className="discount-popup-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) closePopup();
            }}
        >
            <section
                className="discount-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="discount-popup-title"
            >
                <img
                    src={getImage("s1ck-logo-transparent.webp")}
                    alt="S1CK"
                    className="discount-popup-logo"
                />

                {submitted ? (
                    <div className="discount-popup-success" role="status">
                        <p>YOU'RE IN.</p>
                        <span>Check your inbox for your 10% welcome offer.</span>
                    </div>
                ) : (
                    <>
                        <h2 id="discount-popup-title">GET 10% OFF</h2>

                        <form
                            className="discount-popup-form"
                            method="post"
                            action="/contact#s1ck-newsletter-popup"
                            acceptCharset="UTF-8"
                            onSubmit={handleSubmit}
                        >
                            <input type="hidden" name="form_type" value="customer" />
                            <input type="hidden" name="utf8" value="✓" />
                            <input type="hidden" name="contact[tags]" value="newsletter,popup" />
                            <label className="sr-only" htmlFor="discount-popup-email">
                                Email address
                            </label>
                            <input
                                ref={emailRef}
                                id="discount-popup-email"
                                name="contact[email]"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <button type="submit">SUBMIT</button>
                        </form>

                        <button className="discount-popup-pass" type="button" onClick={closePopup}>
                            No, I’ll pass
                        </button>
                    </>
                )}
            </section>
        </div>
    );
};

export default EmailDiscountPopup;
