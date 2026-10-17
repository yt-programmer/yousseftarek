import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { useSiteContent } from "../../context/SiteContentContext";
import PhoneInput from "../common/PhoneInput";

const inputClass = "w-full rounded-lg border border-[var(--color-primary)]/50 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-[var(--color-primary)]";
const slug = (value, index) => String(value || `field-${index + 1}`).toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "") || `field-${index + 1}`;

export default function Form() {
  const { content } = useSiteContent();
  const configured = content.contactPage?.formFields || [];
  const fields = configured.map((field, index) => typeof field === "string"
    ? ({ key: slug(field, index), label: field, type: /email/i.test(field) ? "email" : /phone|mobile|whatsapp|tel/i.test(field) ? "tel" : /message|description/i.test(field) ? "textarea" : "text", required: true, order: index + 1 })
    : ({ ...field, key: field.key || slug(field.label, index), label: field.label || field.key || `Field ${index + 1}`, type: field.type || "text", order: Number(field.order) || index + 1 }))
    .sort((a, b) => a.order - b.order);
  const [loading, setLoading] = React.useState(false);
  const [resetVersion, setResetVersion] = React.useState(0);

  const onSubmitHandle = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const values = Object.fromEntries(fields.map((field) => [field.key, String(formData.get(field.key) || "").trim()]));
    const nameField = fields.find((field) => /^(name|full[-_]?name)$/i.test(field.key));
    const emailField = fields.find((field) => /email/i.test(field.key) || field.type === "email");
    const messageField = fields.find((field) => /^(message|comment|description)$/i.test(field.key) || field.type === "textarea");
    setLoading(true);
    try {
      await toast.promise(axios.post(`${(import.meta.env.VITE_API || "").replace(/\/$/, "")}/api/sendmail`, { fields: values, name: nameField ? values[nameField.key] : "", email: emailField ? values[emailField.key] : "", message: messageField ? values[messageField.key] : "" }), { loading: "Sending message...", success: "Message sent successfully!", error: "Could not send message." });
      formElement.reset();
      setResetVersion((version) => version + 1);
    } catch (err) { toast.error(err.response?.data?.message || err.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  return <motion.section initial={{ opacity:  0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: .4 }} className="mt-8 grid gap-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-8 lg:grid-cols-[.8fr_1.2fr]">
    <div><h3 className="text-2xl font-bold"><span className="text-[var(--color-primary)]"># </span>{content.contactPage?.sendMessageTitle || "Send a message"}</h3><p className="mt-4 leading-7 text-gray-400">{content.contactPage?.formDescription || content.contactPage?.description || "Have a question or project in mind? Send me a message."}</p><p className="mt-5 text-xs leading-5 text-gray-500">Your details are used only to respond to your message.</p></div>
    <form onSubmit={onSubmitHandle} className="grid gap-4 sm:grid-cols-2">
      {fields.map((field, index) => <motion.div key={field.key} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .25, delay: Math.min(index * .04, .2) }} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
        {field.type === "tel" || /phone|mobile|whatsapp|telephone/i.test(`${field.key} ${field.label}`) ? <PhoneInput key={`${field.key}-${resetVersion}`} name={field.key} label={field.label} required={Boolean(field.required)} placeholder="Phone number" /> : <label className="grid gap-2 text-sm text-gray-300"><span>{field.label}{field.required ? " *" : ""}</span>{field.type === "textarea" ? <textarea className={`${inputClass} min-h-36 resize-y`} name={field.key} required={Boolean(field.required)} rows={5} maxLength={Number(field.maxLength) || 5000} placeholder={field.placeholder || ""}/> : <input className={inputClass} name={field.key} type={["email", "url", "number", "date"].includes(field.type) ? field.type : "text"} required={Boolean(field.required)} maxLength={Number(field.maxLength) || 5000} autoComplete={field.type === "email" ? "email" : undefined} placeholder={field.placeholder || ""}/>}</label>}
      </motion.div>)}
      <div className="sm:col-span-2"><motion.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : .98 }}><Button type="submit" variant="outlined" disabled={loading} sx={{ borderRadius: "8px", borderColor: "var(--color-primary)", backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)", color: "white", padding: "10px 24px", textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "var(--color-primary)", backgroundColor: "color-mix(in srgb, var(--color-primary) 18%, transparent)" } }}>{loading ? "Sending…" : content.contactPage?.submitButtonText || "Send message"}</Button></motion.div></div>
    </form>
  </motion.section>;
}
