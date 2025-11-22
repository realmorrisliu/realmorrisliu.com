# Kira Design System

## Philosophy

**"Immersive, Fluid, Context-Aware."**
Kira's design language is built on the concept of a "Second Brain" that feels like a natural extension of your thought process. It prioritizes content over chrome, using high transparency, subtle blurs, and fluid motion to create a workspace that feels alive and breathable.

## Core Visual Traits

- **Glassmorphism**: Extensive use of `backdrop-blur` and translucent backgrounds (`bg-white/40`, `bg-black/5`) to maintain context.
- **Low Saturation**: Colors are muted and sophisticated, using transparency (`/60`, `/40`) rather than solid grays.
- **Soft & Rounded**: Generous border radii (`rounded-3xl`, `rounded-2xl`) create a friendly, organic feel.
- **No Hard Borders**: Borders are extremely subtle (`border-black/5`) or non-existent, relying on depth and shadows.

## Color Palette

### Primary Accent (Kira & System)

Used for AI presence, "Today" highlight, and system notifications.

- **Light**: Purple-600 (`#9333ea`) with `bg-purple-50/50`
- **Dark**: Purple-400 (`#c084fc`) with `bg-purple-900/10`

### User Action Color

**Unified Blue**. Used for all user-generated chat messages, active states, and default selection.

- **Light**: Blue-500 (`#3b82f6`) with `bg-blue-500/30`
- **Dark**: Blue-400 (`#60a5fa`) with `bg-blue-400/20`

### Event & Category Palette (Glass Series)

A curated set of colors for different calendar events and todo tags. All use the `/30` opacity convention for glassmorphism.

| Category        | Color       | Tailwind Class (Bg) | Tailwind Class (Text) |
| :-------------- | :---------- | :------------------ | :-------------------- |
| **Work / Deep** | **Indigo**  | `bg-indigo-500/30`  | `text-indigo-700`     |
| **Personal**    | **Emerald** | `bg-emerald-500/30` | `text-emerald-700`    |
| **Urgent**      | **Orange**  | `bg-orange-500/30`  | `text-orange-800`     |
| **Wellness**    | **Rose**    | `bg-rose-500/30`    | `text-rose-700`       |
| **Study**       | **Teal**    | `bg-teal-500/30`    | `text-teal-700`       |
| **Social**      | **Pink**    | `bg-pink-500/30`    | `text-pink-700`       |

### Neutrals (Glass Surface)

- **Base Layer**: `bg-white/40` (Light) / `bg-white/5` (Dark) + `backdrop-blur-xl`
- **Overlay Layer**: `bg-white/80` (Light) / `bg-black/80` (Dark) + `backdrop-blur-2xl`
- **Subtle Border**: `border-black/5` (Light) / `border-white/10` (Dark)

### Typography (Inter Variable)

- **Body**: `text-black/80` (Light) / `text-white/80` (Dark)
- **Muted**: `text-black/50` (Light) / `text-white/50` (Dark)
- **Sizes**:
  - `text-xs` (12px): Metadata, timestamps
  - `text-sm` (14px): UI elements, buttons
  - `text-[15px]`: Chat messages (optimized for reading)
  - `text-lg` (18px): Input fields

## Component Library

### 1. Containers

- **Main Panel**: `rounded-3xl border border-black/5 bg-white/40 shadow-2xl backdrop-blur-xl`
- **Popovers/Dropdowns**: `rounded-2xl border border-black/5 bg-white/80 shadow-2xl backdrop-blur-xl`

### 2. Buttons & Interactables

- **Ghost**: `hover:bg-black/5` (Light) / `hover:bg-white/5` (Dark)
- **Active/Toggle**: `bg-black text-white` (Light) / `bg-white text-black` (Dark)
- **Icon Button**: `rounded-xl p-2`

### 3. Chat Interface (Kira)

- **AI Message**: **Immersive Text**. No background bubble. Direct text rendering with `text-black/70`.
- **User Message**: **Glass Bubble**. `bg-blue-500/30` + `backdrop-blur-md`. Rounded corners (`rounded-2xl`).
- **Input**: **Floating Bar**. `rounded-2xl border border-black/5 bg-white/40`.

### 4. Calendar Elements

- **Grid**: 8-column layout (Time + 7 Days).
- **Day Pool**: Dashed border (`border-dashed border-black/10`).
- **Event Card**: `rounded-lg p-2 shadow-lg backdrop-blur-md`.

## Motion (Framer Motion)

- **Transitions**: `duration-300 ease-in-out`
- **Hover**: `scale: 1.02` for interactive cards.
- **Entrance**: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`

## Dark Mode Strategy

- **Inversion**: White backgrounds become Black/5 or Black/60.
- **Opacity Adjustment**: Borders become slightly more visible (`white/10`) to define edges in low light.
- **Text Contrast**: Reduced opacity for text (`/80`, `/60`) to prevent eye strain.
