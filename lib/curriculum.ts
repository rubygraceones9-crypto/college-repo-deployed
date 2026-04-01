import { query } from '@/lib/db';

export async function buildCurriculum() {
  await query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      program VARCHAR(20) NOT NULL,
      year_level VARCHAR(20) NOT NULL,
      semester VARCHAR(20) NOT NULL,
      is_archived TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_subject_prog (code, program)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const countRes = await query('SELECT COUNT(*) as c FROM subjects');
  if (Array.isArray(countRes) && (countRes as any)[0]?.c === 0) {
    const { curriculum } = await import('@/data/curriculum');
    for (const prog of Object.keys(curriculum)) {
      for (const yr of Object.keys((curriculum as any)[prog])) {
        for (const sem of Object.keys((curriculum as any)[prog][yr])) {
          for (const subj of (curriculum as any)[prog][yr][sem]) {
            await query(
              'INSERT IGNORE INTO subjects (code, name, program, year_level, semester) VALUES (?, ?, ?, ?, ?)',
              [subj.code, subj.name, prog, yr, sem]
            );
          }
        }
      }
    }
  }

  const rows = await query(
    'SELECT * FROM subjects WHERE is_archived = 0 ORDER BY program, year_level, semester, code'
  );
  const curriculumObj: any = { BSIT: {}, BSEMC: {} };

  for (const s of rows as any[]) {
    if (!curriculumObj[s.program]) curriculumObj[s.program] = {};
    if (!curriculumObj[s.program][s.year_level]) curriculumObj[s.program][s.year_level] = {};
    if (!curriculumObj[s.program][s.year_level][s.semester]) {
      curriculumObj[s.program][s.year_level][s.semester] = [];
    }

    curriculumObj[s.program][s.year_level][s.semester].push({
      code: s.code,
      name: s.name,
    });
  }

  return curriculumObj;
}
