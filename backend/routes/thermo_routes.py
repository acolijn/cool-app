# backend/routes/ph_routes.py
from flask import Blueprint, request, jsonify
from CoolProp.CoolProp import PropsSI
import numpy as np

thermo_blueprint = Blueprint("thermo", __name__)

@thermo_blueprint.route("/ph-data")
def ph_data():
    fluid = request.args.get('fluid', 'Xenon')
    t_step = int(request.args.get('t_step', 25))
    h_min = float(request.args.get('h_min', 0))
    h_max = float(request.args.get('h_max', 1e6))

    T_crit = PropsSI('TCRIT', fluid)
    T_min = np.ceil((PropsSI('TMIN', fluid) + 1) / 10) * 10
    T_max = np.floor((T_crit - 1) / 10) * 10 + 50

    p_min = 1e5
    p_max = PropsSI('PCRIT', fluid) * 2.99
    pressures = np.logspace(np.log10(p_min), np.log10(p_max), 300)

    isotherms = []
    for T in np.arange(T_min, T_max + 1, t_step):
        h_vals, p_vals = [], []
        for p in pressures:
            try:
                h = PropsSI('H', 'T', T, 'P', p, fluid) / 1000
                if h_min <= h <= h_max:
                    h_vals.append(h)
                    p_vals.append(p / 1e5)
            except:
                continue
        if h_vals and p_vals:
            isotherms.append({"T": T, "h": h_vals, "p": p_vals})

    Tsat = np.linspace(T_min, T_max, 300)
    hL, hV, psat = [], [], []
    for T in Tsat:
        try:
            p = PropsSI('P', 'T', T, 'Q', 0, fluid)
            h_liq = PropsSI('H', 'T', T, 'Q', 0, fluid)
            h_vap = PropsSI('H', 'T', T, 'Q', 1, fluid)
            if h_min <= h_liq / 1000 <= h_max and h_min <= h_vap / 1000 <= h_max:
                hL.append(h_liq / 1000)
                hV.append(h_vap / 1000)
                psat.append(p / 1e5)
        except:
            continue

    try:
        h_crit = PropsSI('H', 'T', T_crit, 'Q', 0.5, fluid) / 1000
        p_crit = PropsSI('PCRIT', fluid) / 1e5
    except:
        h_crit, p_crit = None, None

    qualities = []
    for Q in np.linspace(0.1, 0.9, 9):
        h_q, p_q = [], []
        for T in np.linspace(T_min + 1, T_max - 1, 300):
            try:
                h = PropsSI('H', 'T', T, 'Q', Q, fluid) / 1000
                p = PropsSI('P', 'T', T, 'Q', Q, fluid) / 1e5
                if h_min <= h <= h_max:
                    h_q.append(h)
                    p_q.append(p)
            except:
                continue
        if h_q and p_q:
            qualities.append({"Q": round(Q, 2), "h": h_q, "p": p_q})

    return jsonify({
        "isotherms": isotherms,
        "saturation": {"hL": hL, "hV": hV[::-1], "p": psat},
        "qualities": qualities,
        "critical": {"h": h_crit, "p": p_crit}
    })

@thermo_blueprint.route("/ts-data")
def ts_data():
    fluid = request.args.get('fluid', 'Xenon')
    t_step = int(request.args.get('t_step', 25))

    T_crit = PropsSI('TCRIT', fluid)
    T_min = np.ceil((PropsSI('TMIN', fluid) + 1) / 10) * 10
    T_max = np.floor((T_crit - 1) / 10) * 10 + 50

    p_min = 1e5
    p_max = PropsSI('PCRIT', fluid) * 2.99
    pressures = np.logspace(np.log10(p_min), np.log10(p_max), 300)

    isotherms = []
    for T in np.arange(T_min, T_max + 1, t_step):
        s_vals, T_vals = [], []
        for p in pressures:
            try:
                s = PropsSI('S', 'T', T, 'P', p, fluid) / 1000
                s_vals.append(s)
                T_vals.append(T)
            except:
                continue
        if s_vals and T_vals:
            isotherms.append({"T": T, "s": s_vals, "T_vals": T_vals})

    Tsat = np.linspace(T_min, T_max, 300)
    sL, sV, Tsat_out = [], [], []
    for T in Tsat:
        try:
            s_liq = PropsSI('S', 'T', T, 'Q', 0, fluid) / 1000
            s_vap = PropsSI('S', 'T', T, 'Q', 1, fluid) / 1000
            sL.append(s_liq)
            sV.append(s_vap)
            Tsat_out.append(T)
        except:
            continue

    try:
        s_crit = PropsSI('S', 'T', T_crit, 'Q', 0.5, fluid) / 1000
    except:
        s_crit = None

    return jsonify({
        "isotherms": isotherms,
        "saturation": {"sL": sL, "sV": sV[::-1], "T": Tsat_out},
        "critical": {"s": s_crit, "T": T_crit}
    })