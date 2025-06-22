# PowerStack Portfolio

A dynamic, modern developer portfolio website built with Next.js 15 and Tailwind CSS.

## Features

- **Dynamic Content**: All content is loaded from `public/resume.json` using JSON Resume format
- **Optimized Data Loading**: Server-side rendering with caching for better performance
- **Modern Design**: Beautiful, responsive design with smooth animations
- **Dark Mode**: Automatic dark/light mode support
- **JSON Resume Compatible**: Uses the standard JSON Resume schema
- **Sections**:
  - Landing Page with hero section
  - Contact form with social links
  - Navigation ready for About, Experience, Projects, and Blog pages

## Getting Started

1. **Install dependencies**:
```bash
pnpm install
```

2. **Run the development server**:
```bash
pnpm dev
```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Customization

### Update Your Information

Edit `public/resume.json` to customize all content using the JSON Resume format:

- **basics**: Personal information, contact details, summary, and social profiles
- **work**: Work experience with highlights and achievements
- **education**: Educational background and certifications
- **skills**: Technical skills and competencies
- **projects**: Portfolio projects
- **certificates**: Professional certifications
- **interests**: Personal interests and hobbies

The JSON Resume format is a standard schema that's widely supported and can be used with various resume builders and tools.

### Performance Optimization

The portfolio uses several optimization techniques:

- **Server-Side Rendering (SSR)**: Data is loaded on the server for faster initial page loads
- **Data Caching**: Resume data is cached in memory to reduce file system reads
- **Efficient Data Transformation**: JSON Resume format is transformed once and cached
- **Optimized Images**: SVG images for better performance and scalability

### Replace Images

- `public/profile.jpg` - Your profile photo
- `public/resume.pdf` - Your CV/resume file
- Add project images in the `public/` folder

### Styling

The project uses Tailwind CSS for styling. You can customize:

- Colors in component files
- Global styles in `src/app/globals.css`
- Component-specific styles

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js          # Home page
├── components/
│   ├── Header.js        # Navigation header
│   ├── Hero.js          # Hero section
│   └── ContactForm.js   # Contact form
public/
├── resume.json          # Your data
├── profile.jpg          # Profile image
└── resume.pdf          # CV file
```

## Next Steps

This is the landing page implementation. Additional pages will be created:

- `/about` - About page with education and skills
- `/experience` - Work experience timeline
- `/projects` - Project showcase
- `/blog` - Blog/articles listing

## Technology Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and effects
- **SVG Icons** - Custom icons and graphics

## Deployment

The project is ready for deployment on Vercel, Netlify, or any other platform that supports Next.js.

## License

This project is open source and available under the [MIT License](LICENSE).
