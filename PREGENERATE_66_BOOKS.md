# Pre-Generation Commands for All 66 Bible Books

Run any command below from the project root to crawl and compile **all missing chapters** for that specific book into `public/data/` (zero LLM tokens or API keys required).  
Every run merges cleanly into per-book `public/data/content/{lang}/{book}.json`, `public/data/books/{book}.json`, and `public/data/books-manifest.json` without erasing other books or chapters.

> **Tip — Book Number or Slug + Chapter Filter**  
> You can use either `--book=<slug>` or book number `1`–`66` (`--book=24 chapter=all` for Jeremiah, or `--book=24 chapter=3` for a specific chapter).  
> By default, English and Simplified Chinese (`en`, `zh-CN`) are built; append `--langs=all` or `--langs=zh,es,fr,ja` to generate additional languages, or `--no-crawl` once cached in `scripts/.cache/`.

---

## Quick Batch Commands

```bash
# By book number (1 to 66) + chapter=all (example: Book 24 = Jeremiah, all 52 chapters)
npm run pregenerate -- --book=24 chapter=all

# By book number + single chapter (example: Book 24 Chapter 3)
npm run pregenerate -- --book=24 chapter=3

# Chapter 1 of all 66 books + featured chapters
npm run pregenerate -- --all-books

# First 50%+ of all 27 New Testament books (136+ chapters) in Simplified Chinese
npm run pregenerate -- --nt-half --langs=zh-CN

# Full 66-book / 1,189-chapter canon (English + Simplified Chinese)
npm run pregenerate -- --all-canon --langs=en,zh-CN
```

---

## Old Testament (Books 1–39)

```bash
# 1. Genesis (創世記 / 创世记) — 50 chapters
npm run pregenerate -- --book=genesis

# 2. Exodus (出埃及記 / 出埃及记) — 40 chapters
npm run pregenerate -- --book=exodus

# 3. Leviticus (利未記 / 利未记) — 27 chapters
npm run pregenerate -- --book=leviticus

# 4. Numbers (民數記 / 民数记) — 36 chapters
npm run pregenerate -- --book=numbers

# 5. Deuteronomy (申命記 / 申命记) — 34 chapters
npm run pregenerate -- --book=deuteronomy

# 6. Joshua (約書亞記 / 约书亚记) — 24 chapters
npm run pregenerate -- --book=joshua

# 7. Judges (士師記 / 士师记) — 21 chapters
npm run pregenerate -- --book=judges

# 8. Ruth (路得記 / 路得记) — 4 chapters
npm run pregenerate -- --book=ruth

# 9. 1 Samuel (撒母耳記上 / 撒母耳记上) — 31 chapters
npm run pregenerate -- --book=1samuel

# 10. 2 Samuel (撒母耳記下 / 撒母耳记下) — 24 chapters
npm run pregenerate -- --book=2samuel

# 11. 1 Kings (列王紀上 / 列王纪上) — 22 chapters
npm run pregenerate -- --book=1kings

# 12. 2 Kings (列王紀下 / 列王纪下) — 25 chapters
npm run pregenerate -- --book=2kings

# 13. 1 Chronicles (歷代志上 / 历代志上) — 29 chapters
npm run pregenerate -- --book=1chronicles

# 14. 2 Chronicles (歷代志下 / 历代志下) — 36 chapters
npm run pregenerate -- --book=2chronicles

# 15. Ezra (以斯拉記 / 以斯拉记) — 10 chapters
npm run pregenerate -- --book=ezra

# 16. Nehemiah (尼希米記 / 尼希米记) — 13 chapters
npm run pregenerate -- --book=nehemiah

# 17. Esther (以斯帖記 / 以斯帖记) — 10 chapters
npm run pregenerate -- --book=esther

# 18. Job (約伯記 / 约伯记) — 42 chapters
npm run pregenerate -- --book=job

# 19. Psalms (詩篇 / 诗篇) — 150 chapters
npm run pregenerate -- --book=psalm

# 20. Proverbs (箴言) — 31 chapters
npm run pregenerate -- --book=proverbs

# 21. Ecclesiastes (傳道書 / 传道书) — 12 chapters
npm run pregenerate -- --book=ecclesiastes

# 22. Song of Solomon (雅歌) — 8 chapters
npm run pregenerate -- --book=songofsolomon

# 23. Isaiah (以賽亞書 / 以赛亚书) — 66 chapters
npm run pregenerate -- --book=isaiah

# 24. Jeremiah (耶利米書 / 耶利米书) — 52 chapters
npm run pregenerate -- --book=jeremiah

# 25. Lamentations (耶利米哀歌) — 5 chapters
npm run pregenerate -- --book=lamentations

# 26. Ezekiel (以西結書 / 以西结书) — 48 chapters
npm run pregenerate -- --book=ezekiel

# 27. Daniel (但以理書 / 但以理书) — 12 chapters
npm run pregenerate -- --book=daniel

# 28. Hosea (何西阿書 / 何西阿书) — 14 chapters
npm run pregenerate -- --book=hosea

# 29. Joel (約珥書 / 约珥书) — 3 chapters
npm run pregenerate -- --book=joel

# 30. Amos (阿摩司書 / 阿摩司书) — 9 chapters
npm run pregenerate -- --book=amos

# 31. Obadiah (俄巴底亞書 / 俄巴底亚书) — 1 chapter
npm run pregenerate -- --book=obadiah

# 32. Jonah (約拿書 / 约拿书) — 4 chapters
npm run pregenerate -- --book=jonah

# 33. Micah (彌迦書 / 弥迦书) — 7 chapters
npm run pregenerate -- --book=micah

# 34. Nahum (那鴻書 / 那鸿书) — 3 chapters
npm run pregenerate -- --book=nahum

# 35. Habakkuk (哈巴谷書 / 哈巴谷书) — 3 chapters
npm run pregenerate -- --book=habakkuk

# 36. Zephaniah (西番雅書 / 西番雅书) — 3 chapters
npm run pregenerate -- --book=zephaniah

# 37. Haggai (哈該書 / 哈该书) — 2 chapters
npm run pregenerate -- --book=haggai

# 38. Zechariah (撒迦利亞書 / 撒迦利亚书) — 14 chapters
npm run pregenerate -- --book=zechariah

# 39. Malachi (瑪拉基書 / 玛拉基书) — 4 chapters
npm run pregenerate -- --book=malachi
```

---

## New Testament (Books 40–66)

```bash
# 40. Matthew (馬太福音 / 马太福音) — 28 chapters
npm run pregenerate -- --book=matthew

# 41. Mark (馬可福音 / 马可福音) — 16 chapters
npm run pregenerate -- --book=mark

# 42. Luke (路加福音) — 24 chapters
npm run pregenerate -- --book=luke

# 43. John (約翰福音 / 约翰福音) — 21 chapters
npm run pregenerate -- --book=john

# 44. Acts (使徒行傳 / 使徒行传) — 28 chapters
npm run pregenerate -- --book=acts

# 45. Romans (羅馬書 / 罗马书) — 16 chapters
npm run pregenerate -- --book=romans

# 46. 1 Corinthians (哥林多前書 / 哥林多前书) — 16 chapters
npm run pregenerate -- --book=1corinthians

# 47. 2 Corinthians (哥林多後書 / 哥林多后书) — 13 chapters
npm run pregenerate -- --book=2corinthians

# 48. Galatians (加拉太書 / 加拉太书) — 6 chapters
npm run pregenerate -- --book=galatians

# 49. Ephesians (以弗所書 / 以弗所书) — 6 chapters
npm run pregenerate -- --book=ephesians

# 50. Philippians (腓立比書 / 腓立比书) — 4 chapters
npm run pregenerate -- --book=philippians

# 51. Colossians (歌羅西書 / 歌罗西书) — 4 chapters
npm run pregenerate -- --book=colossians

# 52. 1 Thessalonians (帖撒羅尼迦前書 / 帖撒罗尼迦前书) — 5 chapters
npm run pregenerate -- --book=1thessalonians

# 53. 2 Thessalonians (帖撒羅尼迦後書 / 帖撒罗尼迦后书) — 3 chapters
npm run pregenerate -- --book=2thessalonians

# 54. 1 Timothy (提摩太前書 / 提摩太前书) — 6 chapters
npm run pregenerate -- --book=1timothy

# 55. 2 Timothy (提摩太後書 / 提摩太后书) — 4 chapters
npm run pregenerate -- --book=2timothy

# 56. Titus (提多書 / 提多书) — 3 chapters
npm run pregenerate -- --book=titus

# 57. Philemon (腓利門書 / 腓利门书) — 1 chapter
npm run pregenerate -- --book=philemon

# 58. Hebrews (希伯來書 / 希伯来书) — 13 chapters
npm run pregenerate -- --book=hebrews

# 59. James (雅各書 / 雅各书) — 5 chapters
npm run pregenerate -- --book=james

# 60. 1 Peter (彼得前書 / 彼得前书) — 5 chapters
npm run pregenerate -- --book=1peter

# 61. 2 Peter (彼得後書 / 彼得后书) — 3 chapters
npm run pregenerate -- --book=2peter

# 62. 1 John (約翰一書 / 约翰一书) — 5 chapters
npm run pregenerate -- --book=1john

# 63. 2 John (約翰二書 / 约翰二书) — 1 chapter
npm run pregenerate -- --book=2john

# 64. 3 John (約翰三書 / 约翰三书) — 1 chapter
npm run pregenerate -- --book=3john

# 65. Jude (猶大書 / 犹大书) — 1 chapter
npm run pregenerate -- --book=jude

# 66. Revelation (啟示錄 / 启示录) — 22 chapters
npm run pregenerate -- --book=revelation
```
