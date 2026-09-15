import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FormData = {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  age: string;
  pronouns: string;
  state: string;
  city: string;
  phone: string;
  agreed: boolean;
};

type Errors = Record<string, string>;

const initialData: FormData = {
  email: "",
  otp: "",
  firstName: "",
  lastName: "",
  age: "",
  pronouns: "",
  state: "",
  city: "",
  phone: "",
  agreed: false,
};

const cities: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Navi Mumbai", "Thane", "Pune", "Nashik"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"],
  Telangana: ["Hyderabad", "Secunderabad"],
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function TermsPage() {
  return (
    <main className="app-shell">
      <div className="stars" />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="terms-page">
        <button className="back-btn" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Back
        </button>
        <img className="logo terms-logo" src="/assets/logo.jpg" alt="E logo" />
        <p className="eyebrow">EXTEROVERS</p>
        <h1>Terms & Conditions</h1>
        <p className="terms-updated">Last updated: September 2026</p>
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By using this application, you agree to comply with these Terms & Conditions.</p>
          <h2>2. Account Registration</h2>
          <p>Please provide accurate information when completing your profile.</p>
          <h2>3. Email Verification</h2>
          <p>Email verification is simulated in this frontend assessment. No real email or OTP is sent.</p>
          <h2>4. Privacy</h2>
          <p>This demo does not send form data to a backend. Demo profile data is stored locally in your browser.</p>
          <h2>5. Changes</h2>
          <p>These terms may be updated as the application requirements evolve.</p>
        </section>
      </div>
    </main>
  );
}

function App() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  if (window.location.pathname === "/terms") {
    return <TermsPage />;
  }
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const validateStep = () => {
    const next: Errors = {};

    if (step === 1) {
      if (!data.email.trim()) next.email = "Email address is required.";
      else if (!emailRegex.test(data.email.trim())) next.email = "Enter a valid email address.";
    }

    if (step === 2) {
      if (!/^\d{6}$/.test(data.otp)) next.otp = "Enter the 6-digit verification code.";
    }

    if (step === 3) {
      if (!data.firstName.trim()) next.firstName = "First name is required.";
      if (!data.lastName.trim()) next.lastName = "Last name is required.";
      if (!data.age) next.age = "Age is required.";
      else if (Number(data.age) < 18) next.age = "You must be at least 18 years old.";
      else if (Number(data.age) > 100) next.age = "Please enter a valid age.";
      if (!data.pronouns) next.pronouns = "Please select your pronouns.";
      if (!/^\d{10}$/.test(data.phone)) next.phone = "Enter a valid 10-digit phone number.";
    }

    if (step === 4) {
      if (!data.state) next.state = "Please select your state.";
      if (!data.city) next.city = "Please select your city.";
      if (!data.agreed) next.agreed = "Please accept the Terms & Conditions.";
    }

    setErrors(next);
    if (Object.keys(next).length) {
      showToast("Please correct the highlighted fields.");
      return false;
    }
    return true;
  };

  const continueStep = async () => {
    if (!validateStep()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, step === 1 ? 900 : 700));

    if (step === 2 && data.otp !== "123456") {
      setLoading(false);
      setErrors({ otp: "That code is incorrect. Try 123456 for this demo." });
      showToast("Verification failed.");
      return;
    }

    if (step < 4) {
      setStep((current) => current + 1);
      setLoading(false);
    } else {
      localStorage.setItem("exterovers-demo-profile", JSON.stringify(data));
      setLoading(false);
      setStep(5);
    }
  };

  const back = () => {
    setErrors({});
    if (step > 1 && step < 5) setStep((current) => current - 1);
    else navigate("/");
  };

  const progress = useMemo(() => Math.min(step, 4) / 4 * 100, [step]);

  if (step === 5) {
    return (
      <main className="app-shell">
        <div className="ambient ambient-a" />
        <div className="ambient ambient-b" />
        <div className="success-card">
          <div className="success-icon"><Check size={34} /></div>
          <img className="logo success-logo" src="/assets/logo.jpg" alt="E logo" />
          <p className="eyebrow">WELCOME TO THE COMMUNITY</p>
          <h1>You’re all set.</h1>
          <p className="muted">
            Your profile is ready. Start meeting people, discovering events and making memories offline.
          </p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Explore Exterovers <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="stars" />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      {toast && <div className="toast"><ShieldCheck size={17} />{toast}</div>}

      <header className="topbar">
        <button className="brand" onClick={() => navigate("/")}>
          <img className="logo" src="/assets/logo.jpg" alt="E logo" />
          <span>EXTEROVERS</span>
        </button>
        <button className="terms-link" onClick={() => navigate("/terms")}>Terms & Conditions</button>
      </header>

      <section className="signup-layout">
        <div className="intro-panel">
          <div className="intro-badge"><Sparkles size={16} /> REAL PEOPLE. REAL MOMENTS.</div>
          <h1>Meet beyond<br /><span>the screen.</span></h1>
          <p>
            Create your profile in a few simple steps and get ready to connect with people and experiences around you.
          </p>
          <div className="feature-list">
            <div><Check size={17} /> Discover people and local experiences</div>
            <div><Check size={17} /> Build a profile that feels like you</div>
            <div><Check size={17} /> Designed for real-world connections</div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-brand">
            <img className="logo" src="/assets/logo.jpg" alt="E logo" />
          </div>

          <div className="progress-meta">
            <span>STEP {Math.min(step, 4)} OF 4</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>

          {step === 1 && (
            <StepEmail data={data} errors={errors} update={update} onContinue={continueStep} loading={loading} />
          )}
          {step === 2 && (
            <StepOtp data={data} errors={errors} update={update} onContinue={continueStep} onBack={back} loading={loading} onResend={() => showToast("A new demo code has been sent.")} />
          )}
          {step === 3 && (
            <StepProfile data={data} errors={errors} update={update} onContinue={continueStep} onBack={back} loading={loading} />
          )}
          {step === 4 && (
            <StepLocation data={data} errors={errors} update={update} onContinue={continueStep} onBack={back} />
          )}

          <p className="secure-note"><ShieldCheck size={15} /> Front-end demo — no real account or OTP is created.</p>
        </div>
      </section>
    </main>
  );
}

function StepEmail({ data, errors, update, onContinue, loading }: any) {
  return (
    <div className="step">
      <div className="step-icon"><Mail size={21} /></div>
      <p className="eyebrow">LET’S GET STARTED</p>
      <h2>What’s your email?</h2>
      <p className="muted">We’ll use it to verify your account and keep your profile secure.</p>

      <Field label="Email address" error={errors.email}>
        <input
          autoFocus
          type="email"
          value={data.email}
          maxLength={100}
          placeholder="you@example.com"
          onChange={(e) => update("email", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onContinue()}
        />
      </Field>

      <PrimaryButton loading={loading} onClick={onContinue}>Continue <ArrowRight size={18} /></PrimaryButton>
    </div>
  );
}

function StepOtp({ data, errors, update, onContinue, onBack, loading, onResend }: any) {
  const handleOtp = (value: string) => update("otp", value.replace(/\D/g, "").slice(0, 6));

  return (
    <div className="step">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <div className="step-icon"><ShieldCheck size={21} /></div>
      <p className="eyebrow">EMAIL VERIFICATION</p>
      <h2>Enter your code</h2>
      <p className="muted">We sent a 6-digit code to <strong>{data.email}</strong>.</p>

      <div className="otp-row">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            className={errors.otp ? "otp error-input" : "otp"}
            value={data.otp[i] ?? ""}
            inputMode="numeric"
            maxLength={1}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const chars = data.otp.split("");
              chars[i] = digits;
              update("otp", chars.join("").slice(0, 6));
              if (digits) document.getElementById(`otp-${i + 1}`)?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !data.otp[i] && i > 0) {
                document.getElementById(`otp-${i - 1}`)?.focus();
              }
            }}
            id={`otp-${i}`}
          />
        ))}
      </div>

      {errors.otp && <p className="field-error">{errors.otp}</p>}

      <PrimaryButton loading={loading} onClick={onContinue}>Verify email <ArrowRight size={18} /></PrimaryButton>

      <button className="resend" onClick={onResend}>Resend code</button>
      <p className="demo-hint">Demo code: <strong>123456</strong></p>
    </div>
  );
}

function StepProfile({ data, errors, update, onContinue, onBack, loading }: any) {
  return (
    <div className="step">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <p className="eyebrow">YOUR PROFILE</p>
      <h2>Tell us about you</h2>
      <p className="muted">A few details help us create a better experience.</p>

      <div className="two-col">
        <Field label="First name" error={errors.firstName}>
          <input value={data.firstName} maxLength={40} placeholder="First name" onChange={(e) => update("firstName", e.target.value)} />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input value={data.lastName} maxLength={40} placeholder="Last name" onChange={(e) => update("lastName", e.target.value)} />
        </Field>
      </div>

      <div className="two-col">
        <Field label="Age" error={errors.age}>
          <input
            value={data.age}
            inputMode="numeric"
            maxLength={3}
            placeholder="18+"
            onChange={(e) => update("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
          />
        </Field>
        <Field label="Pronouns" error={errors.pronouns}>
          <select value={data.pronouns} onChange={(e) => update("pronouns", e.target.value)}>
            <option value="">Select</option>
            <option value="he/him">He / Him</option>
            <option value="she/her">She / Her</option>
            <option value="they/them">They / Them</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </Field>
      </div>

      <Field label="Phone number" error={errors.phone}>
        <input
          value={data.phone}
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit phone number"
          onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </Field>

      <PrimaryButton loading={loading} onClick={onContinue}>Continue <ArrowRight size={18} /></PrimaryButton>
    </div>
  );
}

function StepLocation({ data, errors, update, onContinue, onBack }: any) {
  const availableCities = cities[data.state] ?? [];

  return (
    <div className="step">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={16} /> Back</button>
      <div className="step-icon"><MapPin size={21} /></div>
      <p className="eyebrow">ONE LAST THING</p>
      <h2>Where are you based?</h2>
      <p className="muted">Choose your state and city so your experience can feel local.</p>

      <Field label="State" error={errors.state}>
        <select
          value={data.state}
          onChange={(e) => {
            update("state", e.target.value);
            update("city", "");
          }}
        >
          <option value="">Select your state</option>
          {Object.keys(cities).map((state) => <option key={state}>{state}</option>)}
        </select>
      </Field>

      <Field label="City" error={errors.city}>
        <select
          value={data.city}
          disabled={!data.state}
          onChange={(e) => update("city", e.target.value)}
        >
          <option value="">{data.state ? "Select your city" : "Select state first"}</option>
          {availableCities.map((city) => <option key={city}>{city}</option>)}
        </select>
      </Field>

      <label className="check-row">
        <input type="checkbox" checked={data.agreed} onChange={(e) => update("agreed", e.target.checked)} />
        <span>I agree to the <a href="/terms" target="_blank">Terms & Conditions</a>.</span>
      </label>
      {errors.agreed && <p className="field-error">{errors.agreed}</p>}

      <PrimaryButton onClick={onContinue}>Complete signup <ArrowRight size={18} /></PrimaryButton>
    </div>
  );
}

function Field({ label, error, children }: any) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, loading, onClick }: any) {
  return (
    <button className="primary-btn" onClick={onClick} disabled={loading}>
      {loading ? <><LoaderCircle size={18} className="spin" /> Please wait...</> : children}
    </button>
  );
}

export default App;