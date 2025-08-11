"use client";
import { useEffect, useState,  useCallback,useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Testimonials from '../components/testimonials';


// Assume these are SVG components or similar you have defined
const Form1 = (props: React.SVGProps<SVGSVGElement>) => (
<svg  {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
  <g clipPath="url(#clip0_134_664)">
    <path d="M10.0124 1.2439C6.63539 1.23948 3.88363 3.98752 3.88367 7.36457C3.88371 9.60954 5.09257 11.5719 6.89471 12.637C7.21473 12.8261 7.40842 13.1727 7.40842 13.5445V15.0353C7.46767 15.0105 7.53264 14.9967 7.60086 14.9967H12.4077C12.4759 14.9967 12.5409 15.0105 12.6002 15.0353V13.5444C12.6002 13.1683 12.8011 12.8227 13.1245 12.6306C14.9208 11.5641 16.1249 9.60508 16.1249 7.36445C16.1249 3.98689 13.389 1.24832 10.0124 1.2439Z" fill="#FFE07D"/>
    <path d="M9.02607 13.5445C9.02607 13.1728 8.83238 12.8261 8.51239 12.637C6.71026 11.5719 5.50135 9.60958 5.50135 7.36461C5.50131 4.26394 7.82112 1.69394 10.8147 1.29732C10.5521 1.26261 10.2844 1.24425 10.0124 1.2439C6.63539 1.23948 3.88363 3.98752 3.88367 7.36457C3.88371 9.60954 5.09257 11.5719 6.89471 12.637C7.21473 12.8261 7.40842 13.1727 7.40842 13.5445V15.0353C7.46763 15.0105 7.53264 14.9967 7.60086 14.9967H9.02607V13.5445Z" fill="#FFC250"/>
    <path d="M14.2741 6.16601C13.9565 4.98231 13.1404 3.99261 12.0352 3.45068C11.8897 3.3793 11.8295 3.20346 11.9009 3.05791C11.9722 2.91236 12.1482 2.85224 12.2937 2.92359C13.5511 3.54011 14.4796 4.66651 14.8411 6.01384C14.8832 6.17039 14.7903 6.3314 14.6337 6.37343C14.4772 6.41543 14.3162 6.32267 14.2741 6.16601Z" fill="#FFEAC8"/>
    <path d="M8.81909 19.2947V19.5097C8.81909 20.1617 9.35249 20.6951 10.0044 20.6951C10.6563 20.6951 11.1897 20.1617 11.1897 19.5097V19.2947H8.81909Z" fill="#8479C2"/>
    <path d="M9.88005 19.5097V19.2947H8.81897V19.5097C8.81897 20.1617 9.35237 20.6951 10.0043 20.6951C10.1947 20.6951 10.3749 20.6493 10.5348 20.5686C10.1475 20.373 9.88005 19.9712 9.88005 19.5097Z" fill="#6E60B8"/>
    <path d="M2.46 7.50136H1.45027C1.28816 7.50136 1.15674 7.36994 1.15674 7.20783C1.15674 7.04573 1.28816 6.91431 1.45027 6.91431H2.46C2.6221 6.91431 2.75353 7.04573 2.75353 7.20783C2.75353 7.36994 2.6221 7.50136 2.46 7.50136Z" fill="#FFC250"/>
    <path d="M2.74815 5.6387L1.80409 5.28041C1.65251 5.22287 1.57628 5.05337 1.63381 4.90183C1.69134 4.7503 1.8608 4.6741 2.01238 4.73155L2.95644 5.08985C3.10802 5.14738 3.18426 5.31688 3.12673 5.46842C3.06923 5.61988 2.89985 5.6962 2.74815 5.6387Z" fill="#FFC250"/>
    <path d="M1.6338 9.51385C1.57627 9.36227 1.65255 9.19277 1.80409 9.13528L2.74815 8.77698C2.89965 8.71949 3.06919 8.79569 3.12672 8.94726C3.18425 9.09884 3.10797 9.26834 2.95644 9.32584L2.01237 9.68414C1.86076 9.74163 1.69133 9.66539 1.6338 9.51385Z" fill="#FFC250"/>
    <path d="M18.5584 7.50136H17.5487C17.3865 7.50136 17.2551 7.36994 17.2551 7.20783C17.2551 7.04573 17.3865 6.91431 17.5487 6.91431H18.5584C18.7205 6.91431 18.852 7.04573 18.852 7.20783C18.852 7.36994 18.7205 7.50136 18.5584 7.50136Z" fill="#FFC250"/>
    <path d="M16.882 5.46842C16.8244 5.31685 16.9007 5.14734 17.0523 5.08985L17.9963 4.73155C18.1478 4.6741 18.3174 4.75026 18.3749 4.90184C18.4324 5.05342 18.3561 5.22292 18.2046 5.28041L17.2605 5.63871C17.109 5.6962 16.9395 5.61996 16.882 5.46842Z" fill="#FFC250"/>
    <path d="M17.9963 9.68413L17.0523 9.32583C16.9007 9.2683 16.8244 9.0988 16.882 8.94726C16.9395 8.79572 17.109 8.71948 17.2605 8.77698L18.2046 9.13527C18.3562 9.19281 18.4324 9.36231 18.3749 9.51385C18.3174 9.66531 18.148 9.74162 17.9963 9.68413Z" fill="#FFC250"/>
    <path d="M12.0166 17.8523H7.99199C7.71115 17.8523 7.48267 18.0808 7.48267 18.3616V18.7952C7.48267 19.076 7.71115 19.3045 7.99199 19.3045H12.0166C12.2974 19.3045 12.5259 19.076 12.5259 18.7952V18.3616C12.5259 18.0808 12.2975 17.8523 12.0166 17.8523Z" fill="#EFECEF"/>
    <path d="M12.0166 18.5784H7.99199C7.76199 18.5784 7.56732 18.4251 7.50431 18.2153C7.49038 18.2617 7.48267 18.3107 7.48267 18.3616V18.7951C7.48267 19.076 7.71115 19.3045 7.99199 19.3045H12.0166C12.2974 19.3045 12.5259 19.076 12.5259 18.7951V18.3616C12.5259 18.3107 12.5182 18.2617 12.5043 18.2153C12.4412 18.425 12.2466 18.5784 12.0166 18.5784Z" fill="#E2DFE2"/>
    <path d="M12.4078 16.4197H7.60088C7.32003 16.4197 7.09155 16.6482 7.09155 16.929V17.3626C7.09155 17.6434 7.32003 17.8719 7.60088 17.8719H12.4078C12.6886 17.8719 12.9171 17.6434 12.9171 17.3626V16.929C12.9171 16.6482 12.6886 16.4197 12.4078 16.4197Z" fill="#EFECEF"/>
    <path d="M12.4078 17.1458H7.60088C7.37091 17.1458 7.17625 16.9925 7.1132 16.7827C7.09926 16.8291 7.09155 16.8781 7.09155 16.929V17.3625C7.09155 17.6434 7.32003 17.8719 7.60088 17.8719H12.4078C12.6886 17.8719 12.9171 17.6434 12.9171 17.3625V16.929C12.9171 16.8781 12.9094 16.8291 12.8954 16.7827C12.8324 16.9925 12.6378 17.1458 12.4078 17.1458Z" fill="#E2DFE2"/>
    <path d="M12.4078 14.9871H7.60088C7.32003 14.9871 7.09155 15.2155 7.09155 15.4964V15.9299C7.09155 16.2108 7.32003 16.4393 7.60088 16.4393H12.4078C12.6886 16.4393 12.9171 16.2108 12.9171 15.9299V15.4964C12.9171 15.2155 12.6886 14.9871 12.4078 14.9871Z" fill="#EFECEF"/>
    <path d="M12.4078 15.7131H7.60088C7.37091 15.7131 7.17625 15.5598 7.1132 15.3501C7.09926 15.3965 7.09155 15.4455 7.09155 15.4964V15.9299C7.09155 16.2108 7.32003 16.4392 7.60088 16.4392H12.4078C12.6886 16.4392 12.9171 16.2108 12.9171 15.9299V15.4964C12.9171 15.4455 12.9094 15.3965 12.8954 15.3501C12.8324 15.5598 12.6378 15.7131 12.4078 15.7131Z" fill="#E2DFE2"/>
    <path d="M12.2846 2.91994C12.139 2.84856 11.9632 2.90871 11.8918 3.05426C11.8205 3.19981 11.8806 3.37565 12.0262 3.44704C13.1314 3.98901 13.9475 4.9787 14.2651 6.16236C14.3072 6.31907 14.4683 6.41182 14.6247 6.36979C14.7813 6.32779 14.8742 6.16678 14.8322 6.0102C14.4706 4.66283 13.542 3.53647 12.2846 2.91994Z" fill="#262626"/>
    <path d="M2.74461 7.20417C2.74461 7.04207 2.61323 6.91064 2.45109 6.91064H1.44135C1.27921 6.91064 1.14783 7.04207 1.14783 7.20417C1.14783 7.36628 1.27921 7.4977 1.44135 7.4977H2.45109C2.61323 7.4977 2.74461 7.36628 2.74461 7.20417Z" fill="#262626"/>
    <path d="M2.94753 5.08595L2.00347 4.72765C1.85201 4.67019 1.68243 4.74636 1.6249 4.89793C1.56736 5.04951 1.6436 5.21901 1.79518 5.2765L2.73924 5.6348C2.89102 5.69233 3.06036 5.61594 3.11781 5.46452C3.17531 5.31298 3.09911 5.14348 2.94753 5.08595Z" fill="#262626"/>
    <path d="M2.73935 8.7733L1.79529 9.1316C1.64371 9.18913 1.56751 9.35863 1.625 9.51017C1.68246 9.66167 1.85184 9.73799 2.00357 9.68046L2.94764 9.32216C3.09921 9.26463 3.17541 9.09513 3.11792 8.94359C3.06043 8.79201 2.89089 8.71585 2.73935 8.7733Z" fill="#262626"/>
    <path d="M18.5495 6.91064H17.5397C17.3776 6.91064 17.2462 7.04207 17.2462 7.20417C17.2462 7.36628 17.3776 7.4977 17.5397 7.4977H18.5495C18.7117 7.4977 18.843 7.36628 18.843 7.20417C18.843 7.04207 18.7117 6.91064 18.5495 6.91064Z" fill="#262626"/>
    <path d="M17.2516 5.63505L18.1957 5.27675C18.3473 5.21922 18.4235 5.04972 18.366 4.89818C18.3085 4.74656 18.1389 4.67044 17.9874 4.7279L17.0433 5.0862C16.8918 5.14373 16.8156 5.31323 16.873 5.46477C16.9305 5.61623 17.0999 5.69254 17.2516 5.63505Z" fill="#262626"/>
    <path d="M18.1957 9.1316L17.2516 8.7733C17.1001 8.71585 16.9306 8.79201 16.8731 8.94359C16.8155 9.09516 16.8918 9.26467 17.0433 9.32216L17.9874 9.68046C18.1392 9.73799 18.3085 9.66159 18.366 9.51017C18.4235 9.35863 18.3473 9.18913 18.1957 9.1316Z" fill="#262626"/>
    <path d="M10.6479 1.57013C13.2988 1.86534 15.404 3.91694 15.7675 6.55919C15.7895 6.71922 15.9369 6.83205 16.0983 6.80998C16.2589 6.78791 16.3711 6.63977 16.349 6.47919C16.1565 5.07911 15.4908 3.76192 14.4747 2.77026C13.4568 1.77689 12.1209 1.1435 10.7129 0.986676C10.5517 0.968829 10.4066 1.08479 10.3887 1.24592C10.3707 1.40705 10.4868 1.55217 10.6479 1.57013Z" fill="#262626"/>
    <path d="M16.1178 7.59653C15.957 7.58295 15.8142 7.70244 15.8004 7.86395C15.6408 9.72926 14.5813 11.4155 12.9659 12.3745C12.5539 12.6192 12.2979 13.066 12.2979 13.5407V14.6995H11.0557V12.3661C11.0557 12.2313 11.1011 12.0983 11.1835 11.9916L11.6036 11.4478C11.7649 11.2388 11.8538 10.9784 11.8538 10.7144V8.59206C12.0159 8.59198 12.1472 8.4606 12.1472 8.29853C12.1472 8.13646 12.0159 8.00508 11.8538 8.005V7.97299C11.8538 7.81088 11.7224 7.67946 11.5603 7.67946C11.3981 7.67946 11.2667 7.81088 11.2667 7.97299V8.00496H8.72441V7.97299C8.72441 7.81088 8.59302 7.67946 8.43088 7.67946C8.26874 7.67946 8.13735 7.81088 8.13735 7.97299V8.00496C7.97529 8.00504 7.84394 8.13642 7.84394 8.29849C7.84394 8.46056 7.97529 8.59194 8.13735 8.59202V10.7144C8.13735 10.9784 8.22623 11.2388 8.38759 11.4477L8.80765 11.9915C8.89004 12.0983 8.93547 12.2312 8.93547 12.366V14.6994H7.69327V13.5407C7.69327 13.0649 7.44119 12.6203 7.03537 12.3805C5.26701 11.3354 4.16851 9.41194 4.16848 7.36073C4.16844 4.39004 6.39318 1.90073 9.3434 1.57038C9.50449 1.55234 9.62045 1.4071 9.60241 1.24601C9.58436 1.08492 9.43964 0.968883 9.27804 0.986964C7.7225 1.16116 6.28488 1.90195 5.23003 3.07289C4.16691 4.25302 3.58138 5.7758 3.58142 7.36073C3.5815 9.70002 4.83819 11.7638 6.73664 12.8858C6.96458 13.0206 7.10617 13.2715 7.10617 13.5406V14.8671C6.91969 15.0123 6.79903 15.2383 6.79903 15.4924V15.926C6.79903 16.1152 6.86587 16.289 6.9769 16.4256C6.86587 16.562 6.79903 16.7358 6.79903 16.9251V17.3587C6.79903 17.6713 6.98133 17.9415 7.24484 18.0706C7.21004 18.1598 7.1902 18.2564 7.1902 18.3577V18.7913C7.1902 19.2286 7.54595 19.5844 7.98327 19.5844H8.51882C8.55976 20.3635 9.20646 20.9847 9.99558 20.9847C10.7847 20.9847 11.4314 20.3634 11.4723 19.5844H12.0078C12.4452 19.5844 12.8009 19.2286 12.8009 18.7913V18.3577C12.8009 18.2564 12.7811 18.1598 12.7463 18.0706C13.0097 17.9415 13.1921 17.6713 13.1921 17.3587V16.9251C13.1921 16.7359 13.1252 16.5621 13.0142 16.4256C13.1252 16.2891 13.1921 16.1153 13.1921 15.926V15.4924C13.1921 15.2383 13.0714 15.0123 12.8849 14.8671V13.5406C12.8849 13.2721 13.0308 13.0187 13.2657 12.8792C15.0435 11.8237 16.2097 9.96749 16.3853 7.91389C16.399 7.75245 16.2793 7.61035 16.1178 7.59653ZM8.85211 11.089C8.76973 10.9823 8.72433 10.8493 8.72433 10.7145V8.59214H11.2667V10.7145C11.2667 10.8493 11.2213 10.9823 11.1389 11.089L10.7188 11.6328C10.5574 11.8418 10.4685 12.1022 10.4685 12.3662V14.6995H9.52241V12.3662C9.52241 12.1022 9.43353 11.8418 9.27213 11.6328L8.85211 11.089ZM9.9955 20.3978C9.5302 20.3978 9.14701 20.0396 9.10717 19.5845H10.8839C10.844 20.0396 10.4608 20.3978 9.9955 20.3978ZM12.2138 18.7914C12.2138 18.905 12.1214 18.9974 12.0078 18.9974C11.5182 18.9974 8.34462 18.9974 7.98323 18.9974C7.86966 18.9974 7.77722 18.905 7.77722 18.7914V18.3579C7.77722 18.2443 7.86962 18.1518 7.98323 18.1518H12.0078C12.1214 18.1518 12.2138 18.2442 12.2138 18.3579V18.7914ZM12.605 17.3588C12.605 17.4724 12.5126 17.5648 12.3989 17.5648C12.1744 17.5648 7.73373 17.5648 7.5921 17.5648C7.47848 17.5648 7.38604 17.4724 7.38604 17.3588V16.9252C7.38604 16.8116 7.47844 16.7192 7.5921 16.7192H12.3989C12.5126 16.7192 12.605 16.8116 12.605 16.9252V17.3588ZM12.605 15.9261C12.605 16.0397 12.5126 16.1321 12.3989 16.1321H7.5921C7.47848 16.1321 7.38604 16.0397 7.38604 15.9261V15.4926C7.38604 15.3757 7.48412 15.2866 7.5921 15.2866H12.3989C12.5117 15.2866 12.605 15.3798 12.605 15.4926V15.9261Z" fill="#262626"/>
  </g>
  <defs>
    <clipPath id="clip0_134_664">
      <rect width="20" height="20" fill="white" transform="translate(0 0.984863)"/>
    </clipPath>
  </defs>
</svg>
);

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
    <g clipPath="url(#clip0_134_526)">
      <path d="M16.3042 12.4129C12.6553 11.3986 9.80461 8.54201 8.7933 4.88662L8.58375 4.12915L8.37419 4.88662C7.36289 8.54205 4.51214 11.3986 0.863281 12.4129C4.51214 13.4271 7.36289 16.2837 8.37419 19.9391L8.58375 20.6966L8.7933 19.9391C9.80457 16.2837 12.6553 13.4271 16.3042 12.4129Z" fill="#FEE45A"/>
      <path d="M16.3025 12.4129C12.6536 11.3986 9.8029 8.54201 8.79159 4.88662L8.58204 4.12915L8.37249 4.88662C8.22159 5.432 8.02974 5.95964 7.80042 6.46598C9.10811 9.35342 10.8532 11.5499 13.9576 12.4129C10.8532 13.2758 9.10811 15.4723 7.80042 18.3597C8.02974 18.8661 8.22159 19.3937 8.37249 19.9391L8.58204 20.6966L8.79159 19.9391C9.80286 16.2837 12.6536 13.4271 16.3025 12.4129Z" fill="#FED402"/>
      <path d="M19.1387 4.55676C17.6923 4.15473 16.5623 3.02243 16.1614 1.57345L16.0784 1.27319L15.9953 1.57345C15.5945 3.02243 14.4645 4.15473 13.0181 4.55676C14.4644 4.95879 15.5944 6.09109 15.9953 7.54007L16.0784 7.84033L16.1614 7.54007C16.5623 6.09109 17.6923 4.95879 19.1387 4.55676Z" fill="#FEE45A"/>
      <path d="M19.1387 4.55676C17.6923 4.15473 16.5623 3.02243 16.1614 1.57345L16.0784 1.27319L15.9953 1.57345C15.8508 2.09585 15.6115 2.57706 15.2968 2.99777C15.2968 2.99777 16.2597 4.29969 17.1846 4.55676C16.2597 4.81384 15.2968 6.11575 15.2968 6.11575C15.6115 6.53646 15.8508 7.01767 15.9953 7.54007L16.0784 7.84033L16.1614 7.54007C16.5623 6.09109 17.6923 4.95879 19.1387 4.55676Z" fill="#FED402"/>
      <path d="M18.0106 18.6057C17.0973 18.3519 16.3839 17.6369 16.1307 16.7221L16.0783 16.5325L16.0258 16.7221C15.7727 17.6369 15.0592 18.3519 14.146 18.6057C15.0592 18.8596 15.7727 19.5745 16.0258 20.4894L16.0783 20.679L16.1307 20.4894C16.3839 19.5745 17.0973 18.8596 18.0106 18.6057Z" fill="#99E6FC"/>
      <path d="M3.88822 6.16749C3.17295 5.96868 2.61417 5.40873 2.41591 4.69217L2.37483 4.5437L2.33376 4.69217C2.13554 5.40873 1.57672 5.96864 0.86145 6.16749C1.57672 6.3663 2.1355 6.92625 2.33376 7.64281L2.37483 7.79128L2.41591 7.64281C2.61417 6.92621 3.17299 6.3663 3.88822 6.16749Z" fill="#99E6FC"/>
      <path d="M16.5965 12.4128C16.5965 12.2812 16.5087 12.1657 16.3819 12.1304C12.4171 11.0283 9.92806 7.89198 8.86537 4.05095C8.78783 3.77078 8.3779 3.77078 8.30037 4.05095C7.23759 7.89229 4.74897 11.0283 0.783904 12.1304C0.504161 12.2082 0.504161 12.6174 0.783904 12.6952C3.19287 13.3648 5.28845 14.8781 6.68459 16.9563C6.8959 17.2709 7.3825 16.9439 7.17119 16.6293C5.8685 14.6903 3.98916 13.2171 1.8142 12.4127C5.04658 11.2165 7.58526 8.51544 8.58285 5.21667C9.58043 8.51544 12.1192 11.2167 15.3517 12.4128C12.1193 13.6089 9.58043 16.3101 8.58285 19.6089C8.41773 19.0629 8.20989 18.5276 7.96345 18.0143C7.79946 17.6727 7.27097 17.9264 7.43503 18.2681C7.82119 19.0725 8.06353 19.9187 8.30037 20.7746C8.3779 21.0548 8.78783 21.0548 8.86537 20.7746C9.92814 16.9333 12.4168 13.7974 16.3819 12.6952C16.5087 12.66 16.5965 12.5445 16.5965 12.4128Z" fill="#262626"/>
      <path d="M19.2171 4.27434C18.6338 4.11223 18.0863 3.81315 17.6337 3.40944C17.513 3.30165 17.3277 3.31228 17.2199 3.43304C17.1121 3.55384 17.1227 3.73913 17.2435 3.84687C17.563 4.13185 17.9237 4.37142 18.31 4.5569C17.3136 5.03713 16.5143 5.87101 16.0783 6.89232C15.6422 5.87093 14.8428 5.0369 13.8462 4.55671C14.8427 4.07655 15.642 3.24268 16.0781 2.22144C16.1239 2.32907 16.1739 2.43506 16.2278 2.53906C16.3023 2.68276 16.4793 2.73876 16.6229 2.66427C16.7667 2.58975 16.8227 2.41282 16.7482 2.26912C16.5716 1.92873 16.4575 1.5646 16.3608 1.19501C16.2833 0.9148 15.8733 0.914839 15.7958 1.19497C15.4115 2.65247 14.4307 3.85977 12.9394 4.2743C12.6597 4.35208 12.6597 4.76134 12.9394 4.83911C14.4308 5.25364 15.4121 6.462 15.7958 7.91844C15.8733 8.19861 16.2833 8.19865 16.3608 7.91844C16.7448 6.46094 17.7259 5.25364 19.217 4.83915C19.4968 4.76134 19.4968 4.35212 19.2171 4.27434Z" fill="#262626"/>
      <path d="M18.0891 18.3233C17.1969 18.0753 16.5725 17.3377 16.3608 16.4543C16.2833 16.1741 15.8733 16.1741 15.7958 16.4543C15.5849 17.3384 14.9597 18.0753 14.0675 18.3233C13.7877 18.4011 13.7877 18.8103 14.0675 18.8881C14.9596 19.1361 15.5841 19.8736 15.7958 20.7571C15.8733 21.0373 16.2833 21.0373 16.3608 20.7571C16.5717 19.873 17.1969 19.1361 18.0891 18.8881C18.3688 18.8103 18.3688 18.4011 18.0891 18.3233ZM16.0783 19.8283C15.8112 19.3171 15.4003 18.8912 14.9009 18.6057C15.4003 18.3202 15.8112 17.8943 16.0783 17.383C16.3454 17.8943 16.7563 18.3202 17.2558 18.6057C16.7563 18.8911 16.3454 19.3171 16.0783 19.8283Z" fill="#262626"/>
      <path d="M0.782928 6.44987C1.45649 6.63711 1.93356 7.2018 2.09231 7.86938C2.16977 8.14963 2.57985 8.14963 2.6573 7.86938C2.81746 7.20043 3.29175 6.6375 3.96668 6.44987C4.24643 6.3721 4.24643 5.96284 3.96668 5.88507C3.29308 5.69783 2.81605 5.13315 2.6573 4.46556C2.57985 4.18531 2.16977 4.18531 2.09231 4.46556C1.93215 5.13447 1.45782 5.69744 0.782928 5.88507C0.503184 5.96284 0.503184 6.37206 0.782928 6.44987ZM2.37483 5.34098C2.57105 5.67614 2.84611 5.96034 3.17376 6.16743C2.84607 6.37452 2.57105 6.65872 2.37483 6.99388C2.17856 6.65872 1.90351 6.37452 1.57589 6.16743C1.90351 5.96038 2.17852 5.67614 2.37483 5.34098Z" fill="#262626"/>
    </g>
    <defs>
      <clipPath id="clip0_134_526">
        <rect width="20" height="20" fill="white" transform="translate(0 0.984863)"/>
      </clipPath>
    </defs>
  </svg>
);



type Dependency = {
  questionIndex: number;
  optionIndex: number;
};

type Option = {
  icon?: string;
  title: string;
  subtitle?: string;
  price: number | string; // allow string in API input!
};

type Question = {
  isDependent: boolean;
  dependentOn?: Dependency;
  type: string;
  questionText: string;
  questionIcon: string;
  questionSubText: string;
  options: Option[];
};

type CostItem = {
  type: string;
  label: string;
  value: string;
  price: number;
};

export default function PreviewPage() {
  const params = useParams() as { department: string };
  const department = params.department;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Option | null>>({});
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  // Ensure totals is always a number
  // const [totals, setTotals] = useState(0);
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [includedItems] = useState([
    "Dedicated Project Manager", "Unlimited Revisions", " Expert Team Collaboration", "Quality Assurance Guaranteed"
  ]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({ name: "", phone: "", email: "" });
  const [toastMessage, setToastMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [disableEmailBtn, setDisableEmailBtn] = useState(false);
  const [disableCallBtn, setDisableCallBtn] = useState(false);
  const [percent, setPercent] = useState(0);
    const [currentVisibleIdx, setCurrentVisibleIdx] = useState(0);
  const [showCallForm, setShowCallForm] = useState(false);


  const totalEstimate = useMemo(() => {
    return Object.values(selectedOptions).reduce((sum, opt) => {
      if (!opt || (opt.price == null)) return sum;
      const price = typeof opt.price === "string" ? parseFloat(opt.price) : Number(opt.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  }, [selectedOptions]);


  // A function to determine if a question should be displayed
const isQuestionVisible = useCallback(
  (question: Question, selected: Record<number, Option | null>): boolean => {
    // not dependent → always visible
    if (!question.isDependent || !Array.isArray(question.dependentOn) || question.dependentOn.length === 0) {
      return true;
    }

    // Group required option indices by questionIndex
    const groups: Record<number, Set<number>> = {};
    for (const dep of question.dependentOn) {
      if (!groups[dep.questionIndex]) groups[dep.questionIndex] = new Set();
      groups[dep.questionIndex].add(dep.optionIndex);
    }

    // For each required previous question (AND across different questionIndex)
    for (const qIdxStr of Object.keys(groups)) {
      const qIdx = Number(qIdxStr);
      const allowed = groups[qIdx];
      const answer = selected[qIdx];
      if (!answer) return false; // no answer for that previous question

      // find index of selected option in original questions array
      if (!questions || !questions[qIdx]) return false;
      const selectedOptIdx = questions[qIdx].options.findIndex(o => o.title === answer.title);
      if (selectedOptIdx === -1) return false;

      // this group is satisfied only if selected option is one of the allowed ones
      if (!allowed.has(selectedOptIdx)) return false;
    }

    return true; // all groups satisfied
  },
  [questions]
);




  // RECALCULATE VISIBLE QUESTIONS AND CURRENT INDEX
useEffect(() => {
  if (!questions) return;
  const visible = questions.filter(q => isQuestionVisible(q, selectedOptions));
  setVisibleQuestions(visible);

  setCurrentVisibleIdx(prev => {
    if (visible.length === 0) return 0;
    if (prev >= visible.length) return visible.length - 1;
    return prev;
  });
}, [questions, selectedOptions, isQuestionVisible]);




 useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/get-questions?dept=${department}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('Failed to fetch questions:', data.message || data);
          return;
        }
        setQuestions(data.questions);
        // Correctly initialize selectedOptions to be an empty object, not an array of nulls
        setSelectedOptions({}); 
      } catch (err) {
        console.error('Error in fetch:', err);
      }
    }
    if (department) load();
  }, [department]);


  
const updateCostItems = useCallback(() => {
  if (!questions) return;

  const newCostItems = Object.entries(selectedOptions).map(([index, option]) => {
    // The keys in selectedOptions are strings, so we need to convert them to numbers
    const questionIndex = parseInt(index, 10);
    const question = questions[questionIndex];

    if (!question || !option) return null;

    return {
      type: question.type,
      label: question.questionText,
      value: option.title,
      price: typeof option.price === "string" ? parseFloat(option.price) : option.price,
    };
  }).filter(item => item !== null); // Filter out any null entries

  setCostItems(newCostItems as CostItem[]);
}, [selectedOptions, questions]);

useEffect(() => {
  updateCostItems();
}, [selectedOptions, updateCostItems]);
  // -------- Compute Progress & Totals ---------------
useEffect(() => {
  if (!questions) return;
  const visibleCount = visibleQuestions.length;
  const answeredCount = visibleQuestions.reduce((acc, q) => {
    const idx = questions.findIndex(qq => qq.questionText === q.questionText);
    if (selectedOptions[idx]) return acc + 1;
    return acc;
  }, 0);
  const newPercent = visibleCount === 0 ? 0 : Math.round((answeredCount / visibleCount) * 100);
  setPercent(newPercent);
}, [selectedOptions, visibleQuestions, currentVisibleIdx, questions]);


useEffect(() => {
  if (visibleQuestions.length === 0 || costItems.length === 0 || totalEstimate === 0) return;

  // Only run if we don't already have an estimateId
  if (typeof window !== "undefined" && !localStorage.getItem("estimateId")) {
    (async () => {
      try {
        const res = await fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: null, phone: null, email: null, quote: costItems, total: totalEstimate }),
        });

        const data = await res.json();
        if (res.ok && data.estimateId) {
          localStorage.setItem("estimateId", data.estimateId);
        }
      } catch (error) {
        console.error("❌ Error saving blank estimate:", error);
      }
    })();
  }
}, [visibleQuestions.length, costItems, totalEstimate]);


  // --- RENDER LOGIC STARTS HERE ---
  // Early return statements should only come after all hooks have been called
  // ------- What to render now? -----------
if (!department || !questions || questions.length === 0)
  return (
    <div className="flex items-center justify-center min-h-[100vh]  bg-white">
      <img src="/BB-web-chai-1.gif" alt="Loading..." className="w-60 h-60" />
    </div>
  );

if (visibleQuestions.length === 0)
  return (
    <div className="text-center text-lg mt-10 text-gray-400">
      No visible questions.
    </div>
  );


  const currentQuestion = visibleQuestions[currentVisibleIdx];
  // The index in the original array for this question:
  const originalIndex = questions.findIndex(
    (q) => q.questionText === currentQuestion.questionText
  );

  // -------- Option selection (always write by original index) ----------
const handleOptionSelect = (opt: Option) => {
  const updated = { ...selectedOptions, [originalIndex]: opt };
  const newVisible = questions.filter(q => isQuestionVisible(q, updated));
  const visibleIndexes = newVisible.map(q => questions.findIndex(qq => qq.questionText === q.questionText));
  const cleaned: Record<number, Option | null> = {};
  visibleIndexes.forEach(idx => {
    if (updated[idx]) cleaned[idx] = updated[idx];
  });
  setSelectedOptions(cleaned);
};


  const hasMultiLineSubtitle = currentQuestion.options.some(opt => opt.subtitle && opt.subtitle.includes('|'));

  const validate = () => {
    const tempErrors = { name: "", phone: "", email: "" };
    let isValid = true;
    if (!formData.name.trim()) { tempErrors.name = "Name is required."; isValid = false; }
    if (!formData.phone.trim()) { tempErrors.phone = "Phone number is required."; isValid = false; } else if (!/^\d{10}$/.test(formData.phone)) { tempErrors.phone = "Phone number must be 10 digits."; isValid = false; }
    if (!formData.email.trim()) { tempErrors.email = "Email is required."; isValid = false; } else if (!/\S+@\S+\.\S+/.test(formData.email)) { tempErrors.email = "Email is not valid."; isValid = false; }
    setErrors(tempErrors);
    return isValid;
  };
  
const handleSubmit = async () => {
  if (!validate()) return;
  const { name, phone, email } = formData;
  const estimateId = typeof window !== "undefined" ? localStorage.getItem("estimateId") : null;

  try {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        quote: costItems,
        total: totalEstimate,
        estimateId,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("✅ Final Form Submitted:", formData);
      setToastMessage("✅ Thank you! We'll connect with you soon.");
      setTimeout(() => setToastMessage(""), 4000);
      setShowCallForm(false);      // hide form
      setDisableCallBtn(true); 


      localStorage.removeItem("estimateId"); // cleanup
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert('Something went wrong while submitting.');
  }
};


const handleEmailSubmit = async () => {
    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }
    try {
        const res = await fetch("/api/send-quotation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // FIX: Use totalEstimate here too
            body: JSON.stringify({ email, quote: costItems, total: totalEstimate }),
        });
        const data = await res.json();
        console.log("API response:", data);

        if (res.ok) {
            setToastMessage("✅ Quotation sent successfully!");
            setTimeout(() => setToastMessage(""), 4000);
            setShowEmailInput(false);
            setEmail("");
            setDisableEmailBtn(false);
        } else {
            alert("❌ Failed to send email.");
        }
    } catch (err) {
        console.error("❌ Error sending email:", err);
        alert("Something went wrong while sending the email.");
    }
};
  




  return (
    <div>
        {toastMessage && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">
    {toastMessage}
  </div>
)}
      <div
        className="w-full h-[500px] md:h-[700px] relative bg-no-repeat bg-center bg-cover px-4 py-10 md:py-0"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative z-10 lg:top-0 top-10">
          
          {/* Text Section */}
          <div className="text-center md:text-left px-5 py-10 space-y-4 w-full md:w-1/2 z-20 md:static absolute top-1/2 left-1/2 md:top-auto md:left-auto transform md:transform-none -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0">
            <h1 className="text-[34px] sm:text-[28px] md:text-5xl  text-black leading-tight">
              Estimate Your Project
              
            </h1>
      
            <div className="flex md:flex-row  items-center justify-center md:justify-start gap-3 sm:gap-5">
             <span
        className="relative flex items-center justify-center w-[93px] h-[43px] text-[26px] sm:text-[32px] md:text-[35px]  text-black text-center capitalize font-Poppins px-2 py-1 rounded-[5px]"
        style={{ background: "#F9B31B", letterSpacing: "0.2px" }}
      >
        Cost
        <Image
          src="/images/Highlight.png"
          alt="highlight"
          width={25}
          height={25}
          className="absolute -top-5 -right-5"
        />
      </span>
      
              <span className="text-[24px] sm:text-[28px] md:text-5xl  text-black">
                Instantly
              </span>
            </div>
      
      <button
  className="mt-6 inline-flex items-center font-poppins justify-center gap-[10px] px-[30px] py-[10px] rounded-[5px] text-white text-[16px] sm:text-[18px]"
  style={{
    background: "#262626",
    boxShadow: "2px 2px 0px 0px #F9B31B",
  }}
  onClick={() => window.location.href = "https://bombayblokes.com/estimates-calculator/"}
>
  Calculate Now
</button>

          </div>
           
      
          {/* Image Section */}
          <div className="relative w-full md:w-[600px] h-[400px] sm:h-[400px] md:h-[553px] z-0 lg:top-20">
            <Image
              src="/images/hero2.png"
              alt="Desk Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>



      <section className="w-full px-4 flex flex-col items-center mt-0 lg:mt-30">
        <h2 className="text-center font-poppins lg:text-[32px] text-[23px] font-bold leading-normal tracking-[-0.8px] capitalize text-black">
          Plan Your Project, Step By Step
        </h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
          <span className="text-center font-poppins text-[20px] font-[400] leading-normal text-[#797474]">
            Calculate your digital dream
          </span>
        </div>
        <div className="w-full max-w-6xl max-h-7xl lg:mt-1 mt-5">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="text-[#797474] text-center font-[Poppins] text-[20px] italic font-light leading-none tracking-[0.2px] capitalize">
              Progress
            </span>
            <span className="text-[#797474] text-center font-[Poppins] text-[20px] not-italic font-light leading-none tracking-[0.2px] capitalize">
              {percent}%
            </span>
          </div>
         <div className="flex gap-3">
  {visibleQuestions.map((_, visibleIdx) => {
    // Find the real index of the visible question in the full questions list
    const question = visibleQuestions[visibleIdx];
    const realIndex = questions.findIndex(q => q.questionText === question.questionText);

    return (
      <div
        key={visibleIdx}
        className="flex-1 h-[10px] rounded-[20px] border border-[#1E1E1E] bg-transparent overflow-hidden"
      >
        <div
          className="h-full bg-[#F9B31B] transition-all duration-500"
          style={{
            width: selectedOptions[realIndex] ? "100%" : "0%",
          }}
        />
      </div>
    );
  })}
</div>

        </div>

        {/* ... The rest of your component remains the same from the previous response ... */}
        {currentStep !== 99 ? (
          hasMultiLineSubtitle ? (
            <div
              className="
                  flex flex-col gap-6
                  mt-8 mb-5
                  w-full
                  max-w-[908px]
                  p-5 md:p-[40px_40px]
                  bg-white rounded-[8px] border border-[#1E1E1E]
                  shadow-[6px_5px_0px_0px_#262626]
                "
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[24px] font-poppins font-[700] text-black">
                      {currentQuestion.questionText}
                    </h3>
                    {currentQuestion.questionIcon?.startsWith("data:image") ? (
                      <img src={currentQuestion.questionIcon} alt="icon" className="w-6 h-6" />
                    ) : (
                      <span>{currentQuestion.questionIcon}</span>
                    )}
                  </div>
                  <p className="text-[#797474] font-poppins text-[16px] font-[400]">
                    {currentQuestion.questionSubText}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:ml-10">
                  <span className="font-poppins text-[14px] font-[400] capitalize text-[#1E1E1E]">
                    Pick One
                  </span>
                  <svg
                    className="w-[15px] h-[10px] mt-[2px]"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.3 1C3.3 0.834315 3.16569 0.7 3 0.7C2.83431 0.7 2.7 0.834315 2.7 1H3.3ZM2.78787 9.21213C2.90503 9.32929 3.09497 9.32929 3.21213 9.21213L5.12132 7.30294C5.23848 7.18579 5.23848 6.99584 5.12132 6.87868C5.00416 6.76152 4.81421 6.76152 4.69706 6.87868L3 8.57574L1.30294 6.87868C1.18579 6.76152 0.995837 6.76152 0.87868 6.87868C0.761522 6.99584 0.761522 7.18579 0.87868 7.30294L2.78787 9.21213ZM3 1H2.7L2.7 9H3H3.3L3.3 1H3Z"
                      fill="#1E1E1E"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-10 gap-5">
            {currentQuestion.options.map((opt, i) => {
            const active = selectedOptions[originalIndex]?.title === opt.title;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect(opt)}

                      className={`flex flex-col justify-between gap-2 rounded-[8px] border transition-colors px-4 py-4 text-left w-full lg:w-[280px] h-[180px] relative ${
                        active
                          ? "bg-[#F9B31B] border-[#1E1E1E] text-white shadow-[2px_2px_0px_0px_#1E1E1E]"
                          : "bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE19F]"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center w-full relative">
                        {opt.icon && (
                          <div className="w-10 h-10 mb-2">
                            {opt.icon.startsWith("data:image") ? (
                              <img src={opt.icon} alt="icon" className="w-full h-full" />
                            ) : (
                              <span>{opt.icon}</span>
                            )}
                          </div>
                        )}
                        <h4 className="md:text-[16px] lg:text-[16px] font-bold font-poppins text-center text-black">
                          {opt.title}
                        </h4>
                        <span
                          className={`absolute top-0 right-0 border rotate-[18deg] text-black border-black px-2 py-0.5 text-xs font-semibold rounded-md `}
                          style={{
                            borderRadius: "5px",
                            border: "2px solid #000",
                          }}
                        >
                          ₹{opt.price}
                        </span>
                      </div>
                      {opt.subtitle && opt.subtitle.trim() !== '' ? (
                        <ul className=" md:text-[12px] lg:text-[14px] font-poppins text-[#444] list-disc ml-5 space-y-1">
                          {opt.subtitle.split("|").map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                          ))}
                        </ul>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className="
                  flex flex-col gap-6
                  mt-8 mb-5
                  w-full max-w-[908px]
                  p-5 md:p-[30px_30px]
                  bg-white rounded-[8px] border border-[#1E1E1E]
                  shadow-[6px_5px_0px_0px_#262626]
                "
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[24px] font-poppins font-[700] text-black">
                      {currentQuestion.questionText}
                    </h3>
                    {currentQuestion.questionIcon?.startsWith("data:image") ? (
                      <img src={currentQuestion.questionIcon} alt="icon" className="w-4 h-4" />
                    ) : (
                      <span>{currentQuestion.questionIcon}</span>
                    )}
                  </div>
                  <p className="text-[#797474] font-poppins text-[16px] font-[400]">
                    {currentQuestion.questionSubText}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:ml-10">
                  <span className="font-poppins text-[14px] capitalize font-[400] text-[#1E1E1E]">
                    Pick One
                  </span>
                  <svg
                    className="w-[15px] h-[10px] mt-[2px]"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.3 1C3.3 0.834315 3.16569 0.7 3 0.7C2.83431 0.7 2.7 0.834315 2.7 1H3.3ZM2.78787 9.21213C2.90503 9.32929 3.09497 9.32929 3.21213 9.21213L5.12132 7.30294C5.23848 7.18579 5.23848 6.99584 5.12132 6.87868C5.00416 6.76152 4.81421 6.76152 4.69706 6.87868L3 8.57574L1.30294 6.87868C1.18579 6.76152 0.995837 6.76152 0.87868 6.87868C0.761522 6.99584 0.761522 7.18579 0.87868 7.30294L2.78787 9.21213ZM3 1H2.7L2.7 9H3H3.3L3.3 1H3Z"
                      fill="#1E1E1E"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentQuestion.options.map((opt, i) => {
            const active = selectedOptions[originalIndex]?.title === opt.title;
                  return (
                    
                    <button
                      key={i}
                      type="button"
                     onClick={() => handleOptionSelect(opt)}

                      className={`flex items-center justify-between gap-4 rounded-[8px] border transition-colors px-3 py-3 text-left w-full ${
                       opt.subtitle?.trim() ? "h-[72px]" : "h-[50px]"
                      } ${
                        active
                          ? "bg-[#F9B31B] border-[#1E1E1E] text-white shadow-[2px_2px_0px_0px_#1E1E1E]"
                          : "bg-white border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#FFE19F]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon ? (
                          <span className="relative inline-flex items-center justify-center w-8 h-5 -top-1">
                            <div className="relative  ">
                              {opt.icon.startsWith("data:image") ? (
                                <img src={opt.icon} alt="icon" className="w-6 h-6" />
                              ) : (
                                <span>{opt.icon}</span>
                              )}
                            </div>
                          </span>
                        ) : (
                          
                          <span
                            className={`w-[12px] h-[12px] rounded-full  border-[2px] ${
                              active ? "bg-black border-black" : "border-[#F9B31B]"
                            }`}
                          />
                        )}
                        <div>
                          <h4 className="text-[#111827] font-poppins md:text-[13px] lg:text-[14px] font-[600]">
                            {opt.title}
                          </h4>
                          {opt.subtitle && opt.subtitle.trim() !== '' ? (
                            <p
                              className={`font-poppins lowercase font-[500]
                                md:text-[10px] lg:text-[12px]
                                ${active ? "text-[#111827]" : "text-[#111827]"}`}
                            >
                              {opt.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span
                        className={`md:text-[13px] lg:text-[14px] font-[500] leading-normal font-poppins ${
                          active ? 'text-white' : 'text-[#111827]'
                        }`}
                      >
                        ₹{opt.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div
            className="
                flex flex-col gap-6
                mt-8 mb-5
                w-full
                max-w-[908px]
                p-4 md:p-[40px_40px]
                bg-white rounded-[8px] border border-[#1E1E1E]
                shadow-[6px_5px_0px_0px_#262626]
              "
          >
            <h2 className=" text-black text-2xl md:text-[24px] font-[700] text-center ">
              Your Project Estimate
            </h2>
            <div
              className="text-center py-4 rounded-md shadow-inner border"
              style={{
                borderRadius: "8px",
                border: "1px solid #1E1E1E",
                background: "#F9B31B",
                boxShadow: "3px 3px 0px 0px #262626",
              }}
            >
              <h3 className="text-white text-center font-poppins text-[24px] font-[700] capitalize tracking-tightest">
                ₹{totalEstimate.toLocaleString()}
              </h3>
              <div className="flex items-center justify-center gap-1 text-center text-[#1E1E1E] font-[Poppins] text-[14px] font-[300] leading-normal">
                <span>Here is What It will Take to Build Your Vision</span>
                <Form1 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-10 ">
                <div>
                  <h4 className=" text-black font-[Poppins] text-[24px] font-[700] leading-normal tracking-[-0.8px] capitalize mb-3 flex items-center gap-2">
                    Whats Always Included
                    <Star className="w-4 h-4" />
                  </h4>
                  <ul className="space-y-3">
                    {includedItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <circle cx="4" cy="4" r="4" fill="#76CA21" />
                        </svg>
                        <span className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[300]  leading-normal">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              {/* <div className="flex items-center  lg:mt-30 md:mt-20 gap-5 self-stretch rounded-[8px] border border-[#FFC250] bg-white shadow-[2px_2px_0px_0px_#F9B31B] p-5 md:p-[20px_15px]"> */}
                   <Testimonials />
                {/* </div> */}
              </div>
              <div
                className="
                    flex flex-col
                   min-h-[400px] max-w-[424px] w-full

                    p-5 md:p-[20px_20px]
                    bg-white rounded-[8px] border border-[#1E1E1E]
                    shadow-[6px_5px_0px_0px_#262626]
                  "
              >
                <h2 className=" flex text-[24px] font-[700] mb-3 gap-2  text-black font-[Poppins] leading-normal tracking-[-0.8px] capitalize">
                  Cost Summary <span><img
                    src="/images/buldings.svg"
                    alt="Profile"
                    className="w-5 h-5 mt-2 "
                  /></span>
                </h2>
                {costItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start mb-2">
                    <p>

                       <span className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] leading-normal not-italic">
{item.type}:
</span>
{" "}
                      <span className="text-[#1E1E1E] font-[Poppins] text-[14px] font-[300] not-italic  leading-normal">
                           {item.value}
                      </span>
                    </p>
                    <p className="whitespace-nowrap text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[500] not-italic  leading-normal">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
                <hr className="my-2 border-black" />
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] not-italic  leading-normal">
                    Estimated Cost:
                  </p>
                  <p className="text-[#1E1E1E] text-center font-[Poppins] text-[14px] font-[700] not-italic leading-normal">
                   ₹{totalEstimate.toLocaleString()}
                  </p>
                </div>
                {!showCallForm ? (
  <button
    onClick={() => setShowCallForm(true)}
    className="w-full mb-3 py-[8px] px-[23px] lg:mt-4 rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-white text-[16px] font-[400] italic flex justify-center items-center gap-[10px] self-stretch transition-all"
   disabled={disableCallBtn}
  >
    Schedule Free Call
  </button>
) : (
  <>
    {/* Inline Form */}
   <div className="grid grid-cols-1 gap-3 mb-3 w-full">
  {/* Name */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="name" className="text-sm font-medium text-black">
      Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      value={formData.name}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }))
      }
      className={`px-3 py-2 border rounded-[8px] focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.name
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your name"
    />
    {errors.name && (
      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
    )}
  </div>

  {/* Phone */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="phone" className="text-sm font-medium text-black">
      Phone
    </label>
    <input
      type="tel"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.phone
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your phone"
    />
    {errors.phone && (
      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
    )}
  </div>

  {/* Email */}
  <div className="flex flex-col gap-1 w-full">
    <label htmlFor="email" className="text-sm font-medium text-black">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-[#1E1E1E] placeholder:text-[#1E1E1E] ${
        errors.email
          ? "border-red-500 focus:ring-red-300"
          : "border-[#1E1E1E] focus:ring-[#F9B31B]"
      }`}
      placeholder="Enter your email"
    />
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
    )}
  </div>
</div>


    {/* Submit Button */}
    <button
      onClick={() => {
        handleSubmit();
  
      }}
      className="w-full py-[8px] px-[23px] mb-3 rounded-[5px] bg-[#262626] shadow-[2px_2px_0px_0px_#F9B31B] text-white text-[16px] font-[400] italic flex justify-center items-center gap-[10px] self-stretch transition-all"
    >
      Submit
    </button>
  </>
)} 

                {!showEmailInput ? (
                  <button
                    onClick={() => {
                      setShowEmailInput(true);
                      setDisableEmailBtn(true);
                    }}
                    className="w-full py-[8px] px-[23px] rounded-[5px] border border-[#1E1E1E] bg-white text-black text-[16px] font-[400] italic shadow-[2px_2px_0px_0px_#1E1E1E] flex justify-center items-center gap-[10px] self-stretch transition disabled:opacity-50"
                    disabled={disableEmailBtn}
                  >
                    Email Me The Quote
                  </button>
                ) : (
                  <div className="grid grid-cols-10 gap-3 items-center w-full">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="col-span-7 p-2 border  border-[#1E1E1E] rounded w-full text-[#1E1E1E] placeholder:text-[#1E1E1E]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="col-span-3 py-[8px] px-[12px] rounded-[5px] bg-[#262626] text-white font-[400] italic shadow-[2px_2px_0px_0px_#F9B31B] transition w-full"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

 

      {currentStep !== 99 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto p-4 gap-4 mb-0 lg:mb-30">
  <button
  onClick={() => {
  if (currentVisibleIdx > 0 && questions && visibleQuestions.length > 0) {
    const newSelectedOptions = { ...selectedOptions };
    const origIdx = questions.findIndex(q => q.questionText === visibleQuestions[currentVisibleIdx].questionText);
    newSelectedOptions[origIdx] = null;  // correct key into original questions
    setSelectedOptions(newSelectedOptions);
    setCurrentVisibleIdx((prev) => prev - 1);
  }
}}

    disabled={currentVisibleIdx === 0}
    className={`w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] italic
                border shadow-[2px_2px_0px_0px_#262626] transition-colors text-[16px] font-[400]
                ${
                  currentVisibleIdx  > 0
                    ? "bg-[#F9B31B] border-[#262626] text-[#262626]"
                    : "bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
  >
    Previous
  </button>

<button
           onClick={() => {
            if (currentVisibleIdx === visibleQuestions.length - 1) {
              setCurrentStep(99); // finished!
            } else {
              setCurrentVisibleIdx((prev) =>
                Math.min(visibleQuestions.length - 1, prev + 1)
              );
            }
          }}
            disabled={!selectedOptions[originalIndex]}
            

            className={`w-[130px] flex items-center justify-center gap-2 py-[10px] rounded-[5px] font-medium
                border-2 transition-colors
                ${
                   selectedOptions[originalIndex]
                    ? "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
                    : "bg-black border-black text-white hover:bg-[#1a1a1a] shadow-[2px_2px_0px_0px_#F9B31B]"
                }`}
  
          >
            {currentVisibleIdx === visibleQuestions.length - 1
            ? "See Estimate"
            : "Next"}
          </button>
</div>

      )}


      
    </div>
  );
}




