# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-05

### Changed

- Unconfigured button fields now store `null` instead of a full JSON object, significantly reducing record size in DatoCMS
- The link type dropdown now includes a "--select--" option, allowing editors to explicitly leave a button unconfigured
- New button fields default to "--select--" (no type pre-selected) instead of the first available type
- Unused link type sub-objects (`record`, `asset`, `url`, `tel`, `email`) are no longer included in the stored JSON
- Properties with no value in the `formatted` output are now omitted instead of being stored as `"key": null`

### Fixed

- Reduced unnecessary JSON payload size for multilingual records with multiple button fields

## [1.0.1] - 2025-04-30

- Initial public release
