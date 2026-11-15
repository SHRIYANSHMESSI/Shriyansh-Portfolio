import {
  createIcons,
  Smartphone,
  Server,
  Atom,
  WifiOff,
  Plug,
  Bot,
  Workflow,
  Rocket,
  Mail,
  Phone,
  Linkedin,
  Github,
  ArrowUpRight,
  ChevronRight,
  Database,
  Code,
  Terminal,
  Sparkles,
} from 'lucide';

// Only the icons used on the site are bundled. Add new ones here when a chip needs them.
export function renderIcons() {
  createIcons({
    icons: { Smartphone, Server, Atom, WifiOff, Plug, Bot, Workflow, Rocket, Mail, Phone, Linkedin, Github, ArrowUpRight, ChevronRight, Database, Code, Terminal, Sparkles },
    attrs: { 'stroke-width': 1.5, 'aria-hidden': 'true' },
  });
}
