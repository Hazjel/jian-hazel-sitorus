// Tags are typed by hand per project, so "scikit-learn" and "Scikit-Learn " must count as one tag.
export const tagKey = (tag) => tag.trim().toLowerCase();

// One label per tag key (the first spelling seen), sorted.
export function uniqueTags(projects) {
  const labels = new Map();
  projects.forEach((p) => (p.tags || []).forEach((t) => {
    if (!labels.has(tagKey(t))) labels.set(tagKey(t), t.trim());
  }));
  return Array.from(labels.values()).sort();
}

export const hasTag = (project, tag) => (project.tags || []).some((t) => tagKey(t) === tagKey(tag));
