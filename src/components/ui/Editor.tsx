"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = { value: string; onChange: (html: string) => void };

// Editor visual TipTap: bold/italic/H2-H4/list/link/gambar/quote/code
export function Editor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "tiptap min-h-[280px] border rounded-[13px] p-[13px] focus:outline-none prose max-w-none" } },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "<p></p>");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <Card className="text-[14px]" as="p">Memuat editor...</Card>;

  const btn = (active: boolean) =>
    `px-[8px] py-[4px] text-[13px] border rounded-[8px] ${active ? "bg-slate-900 text-white" : "bg-white"}`;

  async function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: form });
      const j = await r.json();
      if (!r.ok) { alert(j.error || "Upload gagal"); return; }
      editor?.chain().focus().setImage({ src: j.url }).run();
    };
    input.click();
  }

  function setLink() {
    const url = prompt("URL tautan (https://...)");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="space-y-[8px]">
      <div className="flex gap-[8px] flex-wrap">
        <Button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} variant="ghost"><b>B</b></Button>
        <Button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} variant="ghost"><i>I</i></Button>
        <Button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant="ghost">H2</Button>
        <Button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant="ghost">H3</Button>
        <Button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} variant="ghost">• List</Button>
        <Button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="ghost">1. List</Button>
        <Button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} variant="ghost">Quote</Button>
        <Button type="button" className={btn(editor.isActive("link"))} onClick={setLink} variant="ghost">Link</Button>
        <Button type="button" className={btn(false)} onClick={insertImage} variant="ghost">Gambar</Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
