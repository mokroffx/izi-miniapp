// Reduces a stored name to the single token used in the "Привет, …" greeting.
//
// The dashboard's `users.full_name` holds whatever the student typed — usually
// "Имя Фамилия", sometimes a full "Фамилия Имя Отчество". Greeting someone by
// their full legal name reads like a bank letter, so we take the first
// whitespace-separated token and nothing else.
//
// A hyphenated compound first name ("Анна-Мария") contains no whitespace, so
// the plain split already keeps it intact — no hyphen-specific handling needed.
export function greetingName(fullName) {
  if (typeof fullName !== 'string') return null;
  const [first] = fullName.trim().split(/\s+/);
  return first || null;
}

export default greetingName;
