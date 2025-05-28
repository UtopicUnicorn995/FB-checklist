export const convertDate = (
  date,
  format = '{month} {day}, {year} {hour}:{minute} {ampm}',
) => {
  const months = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];

  const d = new Date(date);
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const formattedDate = format
    .replace('{month}', month)
    .replace('{day}', day)
    .replace('{year}', year)
    .replace('{hour}', hours)
    .replace('{minute}', minutes.toString().padStart(2, '0'))
    .replace('{ampm}', ampm);

  return formattedDate;
};

export const sortChecklist = (
  checklist,
  sortBy = 'createdAt',
  order = 'asc',
) => {
  if (!Array.isArray(checklist)) return [];

  return checklist.sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'title') {
      valueA = a.title?.toLowerCase() || '';
      valueB = b.title?.toLowerCase() || '';
    } else {
      valueA = new Date(a[sortBy]);
      valueB = new Date(b[sortBy]);
    }

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const capitalize = text => {
  if (typeof text !== 'string' || text.length === 0) {
    return '';
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function colorToRgba(color, alpha = 1) {
  // Handle hex
  if (color?.[0] === '#') {
    let c = color.replace('#', '');
    if (c.length === 3)
      c = c
        .split('')
        .map(x => x + x)
        .join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${
      num & 255
    },${alpha})`;
  }
  // Handle some named colors (expand as needed)
  const named = {
    red: 'rgba(255,0,0,' + alpha + ')',
    blue: 'rgba(0,0,255,' + alpha + ')',
    green: 'rgba(0,128,0,' + alpha + ')',
    black: 'rgba(0,0,0,' + alpha + ')',
    white: 'rgba(255,255,255,' + alpha + ')',
    // add more if needed
  };
  if (named[color]) return named[color];
  // Fallback: just return the color (no opacity)
  return color;
}
