"""
Trying to figure best uniform cubic b-spline control points for line segment and a circle.
Results: for line segments control points [2*A-B, A, B, 2*B-A] are perfect, 
with C(0)=A, C(1)=B, constant speed C'(t)=B-A.

For the unit circle S^1 a family of good approximations (parametrized by num=3,4,...):
``` 
phi = 2*np.pi/num
r = 3 / (2 + np.cos(phi))
cpts = np.array([(
    r*np.cos(k*phi), 
    r*np.sin(k*phi)
) for k in range(-1, num+2)])
``` 
Then the maximum error 
    max_t |C(t) - exp(2*pi*i*t)|
is roughly 4.06/num^4 (for large num, see error_exact) at angles (0.5+k)*2*pi/num.
For approximation num=6 (9 control points) is fine with max error ~0.0041. 
For closer result can use num=8 (11 control points) with max err ~0.0012 (exact at +-e1,+-e2).
All the errors are in the direction of the origin, in other words the curve is fully inside S^1.
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import BSpline
from scipy.optimize import curve_fit

A = np.array([0.0, 1.0])
B = np.array([1.0, 2.0])

# This has constant speed, see derivative_test or compute by hand
control_points_line_segment = np.array([2*A-B, A, B, 2*B-A])

def control_points_circle(num):
    phi = 2*np.pi/num
    r = 3 / (2 + np.cos(phi))
    cpts = np.array([(r*np.cos(k*phi), r*np.sin(k*phi)) for k in range(-1, num+2)])
    print(f'{num=}, {len(cpts)=}, {r=}')
    return cpts

def plot_splines(control_points, m=1000, error_mag=10, title=''):
    # main plot
    # Uniform cubic B-spline setup
    n = len(control_points)
    deg = 3  # cubic
    t = np.linspace(0, 1, m)
    knots = np.linspace(0, n+deg, n+deg+1)

    spline = BSpline(knots, control_points, deg)
    curve = spline(np.linspace(knots[deg], knots[n], m))
    circle = np.array([np.cos(2*np.pi*t), np.sin(2*np.pi*t)])

    if error_mag > 0:
        curve_with_error_magnified = curve + error_mag*(curve - circle.T)

    plt.figure(figsize=(8, 8))
    plt.plot(*control_points.T, 'o--', label='Control Points')
    plt.plot(*curve.T, '-', lw=2, label='B-spline Curve')
    if error_mag > 0:
        plt.plot(*curve_with_error_magnified.T, '-', lw=2, label=f'Curve Error Magnified x {error_mag}')
    plt.plot(*circle, '-', lw=2, label='Unit Circle')
    plt.legend()
    plt.grid()
    plt.axis('equal')
    if title:
        plt.suptitle(title)

def derivative_test():
    # checking that spline for line segment has constant speed
    t = np.linspace(0, 1, 100)
    dB0 = (-3*t*t + 6*t - 3) / 6
    dB1 = (9*t*t - 12*t) / 6
    dB2 = (-9*t*t + 6*t + 3) / 6
    dB3 = (3*t*t) / 6
    b = np.array([-1, 0, 1, 2])
    fn = dB0*b[0] + dB1*b[1] + dB2*b[2] + dB3*b[3]

    fn_graph = np.array([t, fn])

    plt.figure()
    plt.plot(*fn_graph, '-', lw=2, label='Circle')
    plt.legend()
    plt.grid()

def compute_error(control_points, m=10000):
    # numerically estimate max error
    # Uniform cubic B-spline setup
    n = len(control_points)
    deg = 3  # cubic
    t = np.linspace(0, 1, m)
    knots = np.linspace(0, n+deg, n+deg+1)

    spline = BSpline(knots, control_points, deg)
    curve = spline(np.linspace(knots[deg], knots[n], m))
    circle = np.array([np.cos(2*np.pi*t), np.sin(2*np.pi*t)])
    line_segment = A + t[:,np.newaxis]*(B-A)

    errors = []
    for k in range(m):
        p = curve.T[:,k]
        q = circle[:,k]
        # q = line_segment.T[:,k]

        current_error = np.linalg.norm(p-q)
        # current_error = np.linalg.norm(np.linalg.norm(p)-1.0)

        errors.append(current_error)

    # print(f'{np.average(errors) = }')
    print(f'{np.max(errors)     = }')
    return errors

def plot_error(control_points, m=1000):
    # plots errors at different parts
    t = np.linspace(0, 1, m)
    errors = compute_error(control_points, m)

    error_graph = np.array([t, errors])

    plt.figure()
    plt.plot(*error_graph, '-', lw=2, label='Error')
    plt.legend()
    plt.grid()

def plot_error_data(error_data):
    # Plots num (linear x-axis) vs max error (logarithmic y-axis).
    data = np.array(error_data)
    x = data[:,0]
    y = data[:,1]
    
    plt.figure(figsize=(8, 6))
    
    plt.semilogy(x, y, 'o-', markersize=8, linewidth=2,
                markerfacecolor='white', markeredgewidth=2,
                label='Error')
    
    # Formatting
    plt.title("Maximum error for num points", fontsize=14)
    plt.xlabel("num", fontsize=12)
    plt.ylabel("Maximum error (log scale)", fontsize=14)
    plt.xticks(x)
    plt.grid(True, which="both", linestyle='--', alpha=0.8)
    
    # Annotate errors in scientific notation
    for xi, yi in zip(x, y):
        plt.annotate(f"{yi:.1e}", (xi, yi), 
                    xytext=(0, 8), textcoords="offset points",
                    ha='center', fontsize=12)
    
    plt.legend()
    plt.tight_layout()

def fit_and_plot_log_curve(error_data):
    # Trying to numerically find good curve fit for max_error(num)
    # Convert to numpy array
    data = np.array(error_data)
    x = data[:,0]
    y = np.log(data[:,1])
    
    # Define the function to fit
    def func(x, a, b):
        return a + b*np.log(x)
    
    # Perform curve fitting
    popt, pcov = curve_fit(func, x, y)
    a, b = popt
    print(f'{a=}, {b=}')
    
    # Generate fitted curve points
    x_fit = np.linspace(min(x), max(x), 100)
    y_fit = func(x_fit, a, b)
    
    # Calculate R-squared
    residuals = y - func(x, a, b)
    ss_res = np.sum(residuals**2)
    ss_tot = np.sum((y - np.mean(y))**2)
    r_squared = 1 - (ss_res / ss_tot)
    
    # Plotting
    plt.figure(figsize=(8, 6))
    plt.semilogy(x, np.exp(y), 'o', markersize=8, label='Actual Error')
    plt.semilogy(x_fit, np.exp(y_fit), 'r-', 
                label=f'Fit: y = {np.exp(a):.3f} * x^({b:.3f})\nR² = {r_squared:.4f}')
    
    # Formatting
    plt.title("Error vs. Number of Points with Logarithmic Fit", fontsize=14)
    plt.xlabel("Number of Points", fontsize=12)
    plt.ylabel("Error (log scale)", fontsize=12)
    # plt.xticks(x)
    plt.grid(True, which="both", linestyle='--', alpha=0.6)
    plt.legend(fontsize=12)
    
    # Annotate data points
    for xi, yi in zip(x, y):
        plt.annotate(f"{np.exp(yi):.2e}", (xi, np.exp(yi)), 
                    xytext=(0, 8), textcoords="offset points",
                    ha='center', fontsize=9)
    
    plt.tight_layout()

    return a, b, r_squared

def error_exact(num):
    # Find exact formula for max_error
    # error is maximized at angle pi/num on first segment
    phi = 2*np.pi/num
    x = np.cos(phi)

    r = 3 / (np.cos(phi) + 2)
    print(f'{num=}, {r=}')
    cpts = np.array([(
        r*np.cos(k*phi), 
        r*np.sin(k*phi)
    ) for k in range(-1, 3)])

    # evaluation at t=0.5, which corresponds to maximum error angle pi/num
    p = (cpts[0] + 23*cpts[1] + 23*cpts[2] + cpts[3]) / 48

    # its components are r/48 times
    px = 23 + 24*np.cos(phi) + np.cos(2*phi)
    py = 22*np.sin(phi) + np.sin(2*phi)

    # simplify with trig formulas
    px = 11 + 12*np.cos(phi) + np.cos(phi)*np.cos(phi)
    py = np.sin(phi)*(11 + np.cos(phi))

    # compute px*px+py*py
    # d2 = (11 + 12*x + x*x)**2 + (1-x*x)*(11+x)**2
    # d2 = (121 + 264*x + 166*x*x + 24*x*x*x + x*x*x*x) + (121 + 22*x - 120*x*x - 22*x*x*x - x*x*x*x)
    d2 = 2*(x+1)*(x+11)**2
    assert np.allclose(d2, px*px+py*py)

    # Then the error is 
    # error = 1.0 - r*np.sqrt(px*px+py*py) / 24
    # error = 1.0 - r*(x+11)*np.sqrt(2*(x+1)) / 24
    # error = 1.0 - 3/(x+2)*(x+11)*np.sqrt(2*(x+1)) / 24
    error = 1.0 - (x+11)*np.sqrt(2*(x+1))/(8*(x+2))

    # When num grows, phi tends to 0+ and x tends to 1-. Rewrite error with phi
    # error = 1.0 - (np.cos(phi)+11)*np.sqrt(2*(np.cos(phi)+1))/(8*(np.cos(phi)+2))
    # and use Taylor series up to 4th power of phi:
    # error_approx = 1.0 - (1-phi**2/2+phi**4/24+11)*(2-phi**2/4+phi**4/192)/(8*(1-phi**2/2+phi**4/24+2))
    # error_approx = 1.0 - (12-phi**2/2+phi**4/24)*(2-phi**2/4+phi**4/192)/(8*(3-phi**2/2+phi**4/24))
    # error_approx = ((24-8*phi**2/2+8*phi**4/24) - (12-phi**2/2+phi**4/24)*(2-phi**2/4+phi**4/192))/(24-8*phi**2/2+8*phi**4/24)
    # error_approx = (3*phi**4/48)/(24-8*phi**2/2+8*phi**4/24)
    # error_approx = 3*phi**4/(48*24)
    # error_approx = phi**4 / 384

    # Substitute phi=2*np.pi/num to get 
    # error_approx = np.pi**4 / (24 * num**4)
    error_approx = 4.06 / num**4

    print(error)
    print(error_approx)
    print()
    return error

if __name__ == '__main__':
    # Numerical curve fitting
    # max_errors = []
    # for num in range(3, 30):
    #     cpts = control_points_circle(num)
    #     errors = compute_error(cpts)
    #     max_errors.append([num, np.max(errors)])
    #     print()
    # fit_and_plot_log_curve(max_errors)

    # Draw splines against circle with magnified error
    for num in [6, 8]:
        error = error_exact(num)
        # mag = int(0.3/error)
        mag = 10
        cpts = control_points_circle(num)
        plot_splines(cpts, error_mag=mag, title=f'{num=}, max_error={error:.1e}, error_mag={mag}')

    # plot_error_data(max_errors)

    # plot_error(control_points_circle(3))
    # derivative_test()

    # Test error_exact
    error_exact(3)
    error_exact(4)
    error_exact(5)
    error_exact(200)

    plt.show()