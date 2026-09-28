## Context

In summer 2022 I worked as a Computational Research Assistant at the University of Cambridge through In2Research. The project applied **ab initio random structure searching** (AIRSS) to polyethylene. The idea behind AIRSS is simple and powerful: generate many *random but sensible* starting structures, relax each one with a physical model, and see which low-energy arrangements keep appearing.

## What I built

A Python package that:

1. **Builds polymer chains** with conventional bond lengths and angles (C–C 1.54 Å, C–H 1.10 Å by default).
2. **Creates a randomised periodic box** and places chains without overlaps.
3. **Applies random rotations** to each chain to widen the search.
4. **Relaxes each structure** with the AIREBO force field through LAMMPS, driven from Python with ASE, including the cell shape under a chosen pressure.
5. **Writes the results** in formats that AIRSS tooling and visualisers such as VESTA can read.

The optimised structures agreed with experimental observations, and I presented the work as a poster at the In2Research summer conference.

## Why it's here

It's my earliest substantial code, and it shows the pattern I still follow: specify the constraints precisely (bond geometry, no overlaps, periodic boundaries), generate candidates, then let an objective measure decide. It also involved working on Linux and HPC with scientific Python (NumPy, ASE) inside someone else's research method, which meant understanding their requirements before writing anything.

## Reflection

With what I know now, I'd add tests for the geometry builders, pin dependencies, and separate the random generation from the relaxation step so each could be checked on its own.
