function [IN, OUT] = fuzzySets()
% Membership-function parameters shared by every file (trapezoid [a b c d]).
% Input sets overlap so that Low + Medium + High memberships always add to 1.
IN  = [ 0   0   0  50;      % Low    (Narrow for breadth)
        0  50  50 100;      % Medium
       50 100 100 100];     % High   (Broad for breadth)
% Output sets: Easy / Moderate / Difficult (wider plateaus reach more of 0-100)
OUT = [ 0   0  10  40;      % Easy
       30  45  55  70;      % Moderate
       60  90 100 100];     % Difficult
end
