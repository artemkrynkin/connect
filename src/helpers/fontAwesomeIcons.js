import { library } from '@fortawesome/fontawesome-svg-core';

import {
	farQrCode as farcQrCode,
	farPositionReplacement as farcPositionReplacement,
	farPositionDetach as farcPositionDetach,
	falReceiptsMissing as falcReceiptsMissing,
} from './fontAwecomeCustomIcons';

import { faYandex, faFacebook } from '@fortawesome/free-brands-svg-icons';

import {
	faAngleLeft as fasAngleLeft,
	faAngleRight as fasAngleRight,
	faAngleUp as fasAngleUp,
	faAngleDown as fasAngleDown,
	faHeart as fasHeart,
	faComment as fasComment,
	faBullhorn as fasBullhorn,
	faUserAlt as fasUserAlt,
	faCheckSquare as fasCheckSquare,
	faWallet as fasWallet,
	faPen as fasPen,
	faCircle as fasCircle,
	faClock as fasClock,
	faRubleSign as fasRubleSign,
	faCheckCircle as fasCheckCircle,
	faQuestionCircle as fasQuestionCircle,
	faExclamationCircle as fasExclamationCircle,
	faEye as fasEye,
	faEyeSlash as fasEyeSlash,
	faCamera as fasCamera,
	faUserCircle as fasUserCircle,
} from '@fortawesome/pro-solid-svg-icons';

import {
	faAngleLeft as farAngleLeft,
	faAngleRight as farAngleRight,
	faAngleUp as farAngleUp,
	faAngleDown as farAngleDown,
	faTimes as farTimes,
	faCalendar as farCalendar,
	faClipboard as farClipboard,
	faTrashAlt as farTrashAlt,
	faClone as farClone,
	faEllipsisH as farEllipsisH,
	faEllipsisV as farEllipsisV,
	faCheck as farCheck,
	faCircle as farCircle,
	faDotCircle as farDotCircle,
	faSyncAlt as farSyncAlt,
	faPlus as farPlus,
	faSquare as farSquare,
	faExclamationCircle as farExclamationCircle,
	faChevronDown as farChevronDown,
	faChevronUp as farChevronUp,
	faUndo as farUndo,
	faArchive as farArchive,
	faBoxAlt as farBoxAlt,
	faPen as farPen,
	faFolderPlus as farFolderPlus,
	faFolderMinus as farFolderMinus,
	faTruck as farTruck,
	faCog as farCog,
	faTruckLoading as farTruckLoading,
	faCalendarEdit as farCalendarEdit,
	faTrash as farTrash,
	faComment as farComment,
	faInventory as farInventory,
} from '@fortawesome/pro-regular-svg-icons';

import {
	faAngleLeft as falAngleLeft,
	faAngleRight as falAngleRight,
	faAngleUp as falAngleUp,
	faAngleDown as falAngleDown,
	faTimes as falTimes,
	faTimesCircle as falTimesCircle,
	faQuestionCircle as falQuestionCircle,
	faExclamationCircle as falExclamationCircle,
	faVideo as falVideo,
	faPlus as falPlus,
	faClipboardListCheck as falClipboardListCheck,
	faCheckCircle as falCheckCircle,
	faPlusCircle as falPlusCircle,
	faShippingTimed as falShippingTimed,
	faShoppingCart as falShoppingCart,
	faBagsShopping as falBagsShopping,
	faExternalLinkSquare as falExternalLinkSquare,
	faUndo as falUndo,
	faUsers as falUsers,
	faTachometer as falTachometer,
	faWarehouse as falWarehouse,
	faInventory as falInventory,
	faAnalytics as falAnalytics,
	faShoppingBasket as falShoppingBasket,
	faCog as falCog,
	faReceipt as falReceipt,
	faInfoCircle as falInfoCircle,
	faSearch as falSearch,
	faChartLineDown as falChartLineDown,
	faTruck as falTruck,
	faRobot as falRobot,
	faComment as falComment,
	faScanner as falScanner,
	faFileEdit as falFileEdit,
} from '@fortawesome/pro-light-svg-icons';

import {
	faCheckCircle as fadCheckCircle,
	faExclamationCircle as fadExclamationCircle,
	faBoxAlt as fadBoxAlt,
	faEnvelopeOpenText as fadEnvelopeOpenText,
	faCloudUpload as fadCloudUpload,
} from '@fortawesome/pro-duotone-svg-icons';

library.add(
	// Custom
	farcQrCode,
	farcPositionReplacement,
	farcPositionDetach,
	falcReceiptsMissing,

	// Brands
	faYandex,
	faFacebook,

	// Solid
	fasAngleLeft,
	fasAngleRight,
	fasAngleUp,
	fasAngleDown,
	fasHeart,
	fasComment,
	fasBullhorn,
	fasUserAlt,
	fasCheckSquare,
	fasWallet,
	fasPen,
	fasCircle,
	fasClock,
	fasRubleSign,
	fasCheckCircle,
	fasQuestionCircle,
	fasExclamationCircle,
	fasEye,
	fasEyeSlash,
	fasCamera,
	fasUserCircle,

	// Regular
	farAngleLeft,
	farAngleRight,
	farAngleUp,
	farAngleDown,
	farTimes,
	farCalendar,
	farClipboard,
	farTrashAlt,
	farClone,
	farEllipsisH,
	farEllipsisV,
	farCheck,
	farCircle,
	farDotCircle,
	farSyncAlt,
	farPlus,
	farSquare,
	farExclamationCircle,
	farChevronDown,
	farChevronUp,
	farUndo,
	farArchive,
	farBoxAlt,
	farPen,
	farFolderPlus,
	farFolderMinus,
	farTruck,
	farCog,
	farTruckLoading,
	farCalendarEdit,
	farTrash,
	farComment,
	farInventory,

	// Light
	falAngleLeft,
	falAngleRight,
	falAngleUp,
	falAngleDown,
	falTimes,
	falTimesCircle,
	falQuestionCircle,
	falExclamationCircle,
	falVideo,
	falPlus,
	falClipboardListCheck,
	falCheckCircle,
	falPlusCircle,
	falShippingTimed,
	falShoppingCart,
	falBagsShopping,
	falExternalLinkSquare,
	falUndo,
	falTachometer,
	falWarehouse,
	falInventory,
	falShoppingBasket,
	falAnalytics,
	falUsers,
	falCog,
	falReceipt,
	falInfoCircle,
	falSearch,
	falChartLineDown,
	falTruck,
	falRobot,
	falComment,
	falScanner,
	falFileEdit,

	// Duotone
	fadCheckCircle,
	fadExclamationCircle,
	fadBoxAlt,
	fadEnvelopeOpenText,
	fadCloudUpload
);
